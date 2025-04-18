//src/modules/search_utils.rs

use vercel_runtime::{Body, Error, Request, Response};

use crate::modules::utils::access_token;

use reqwest;
use serde::{Deserialize, Serialize};
use serde_json;
use serde_qs::from_str as from_qs;

/* ──────────────────────────────
   Query‑string helper
   ──────────────────────────── */
#[derive(Deserialize)]
struct SearchQuery {
    q: String,
    offset: Option<usize>,
    limit: Option<usize>,
}

/* ──────────────────────────────
   GraphQL envelope
   ──────────────────────────── */
#[derive(Deserialize)]
struct GraphQlResponse<T> {
    data:   Option<T>,
    errors: Option<serde_json::Value>,
}

/* ──────────────────────────────
   Domain types
   ──────────────────────────── */
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Data {
    pub search: Search,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Search {
    pub hitcount: i64,
    pub works: Vec<Work>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Work {
    #[serde(rename = "workId")]
    pub work_id: String,
    pub titles:          Option<WorkTitles>,
    pub creators:        Option<Vec<Creator>>,
    pub work_year:       Option<PublicationYear>,
    pub material_types:  Option<Vec<MaterialType>>,
    #[serde(rename = "abstract")]
    pub r#abstract:      Option<Vec<String>>,
    pub genre_and_form:  Option<Vec<String>>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct WorkTitles {
    pub full: Option<Vec<String>>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PublicationYear {
    pub display:    Option<String>,
    pub year:       Option<i32>,
    pub end_year:   Option<i32>,
    pub frequency:  Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Creator {
    pub display: Option<String>,
    pub roles:   Option<Vec<Role>>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct MaterialType {
    pub specific: Option<String>,
    pub general:  Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Role {
    pub function_code: Option<String>,
    pub function:      Option<Translation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Translation {
    pub singular: Option<String>,
}

/* ──────────────────────────────
   Lambda handler
   ──────────────────────────── */
pub async fn search_handler(request: Request) -> Result<Response<Body>, Error> {
    /* --- read query params ------------------------------------------------ */
    let query_string = request.uri().query().unwrap_or("");
    let query: SearchQuery = from_qs(query_string).unwrap();

    let offset = query.offset.unwrap_or(0);
    let limit  = query.limit.unwrap_or(12);

    /* --- build GraphQL query --------------------------------------------- */
    let graphql_query = format!(
        r#"
        query search {{
            search(
                q: {{ all: "{}" }}
                filters: {{}}
            ) {{
                hitcount
                works(offset: {}, limit: {}) {{
                    workId
                    titles {{ full }}
                    creators {{
                        display
                        roles {{
                            functionCode
                            function {{ singular }}
                        }}
                    }}
                    workYear {{ display year endYear frequency }}
                    materialTypes {{
                        materialTypeGeneral  {{ display }}
                        materialTypeSpecific {{ display }}
                    }}
                    abstract
                    genreAndForm
                }}
            }}
        }}"#,
        query.q, offset, limit
    );

    /* --- auth token ------------------------------------------------------- */
    let token = access_token().await.map_err(|e| {
        eprintln!("Error retrieving token: {e}");
        Error::from(e.to_string())
    })?;

    /* --- perform request -------------------------------------------------- */
    let graphql_request = serde_json::json!({ "query": graphql_query });
    let client   = reqwest::Client::new();
    let response = client
        .post("https://fbi-api.dbc.dk/bibdk21/graphql")
        .bearer_auth(token)
        .json(&graphql_request)
        .send()
        .await?;

    let status         = response.status();
    let response_text  = response.text().await?;

    /* log raw JSON so you can always inspect it when running `vercel dev` */
    dbg!(&response_text);

    if !status.is_success() {
        eprintln!("GraphQL query failed ({status}): {response_text}");
        return Err(Error::from("Upstream GraphQL returned non‑2xx status"));
    }

    /* --- parse GraphQL envelope ------------------------------------------ */
    let parsed: GraphQlResponse<Data> = serde_json::from_str(&response_text)
        .map_err(|e| Error::from(format!("Failed to parse GraphQL envelope: {e}")))?;

    if let Some(errors) = parsed.errors {
        eprintln!("GraphQL returned errors: {errors}");
        return Err(Error::from("Upstream GraphQL error"));
    }

    let data = parsed
        .data
        .ok_or_else(|| Error::from("GraphQL response missing both `data` and `errors`"))?;

    /* --- respond to the caller ------------------------------------------- */
    let body = serde_json::to_string(&data).unwrap(); // safe: Data is serialisable

    let resp = Response::builder()
        .status(200)
        .header("Content-Type", "application/json")
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Methods", "GET, OPTIONS")
        .header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        .body(Body::Text(body))
        .expect("Failed to build HTTP response");

    Ok(resp)
}