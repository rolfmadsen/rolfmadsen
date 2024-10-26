use vercel_runtime::{Body, Error, Request, Response};
use serde::{Deserialize, Serialize};
use serde_qs::from_str as from_qs;
use crate::modules::utils::access_token;
use serde_json;
use reqwest;

#[derive(Deserialize)]
struct SearchQuery {
    q: String,
    offset: Option<usize>,
    limit: Option<usize>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Root {
    pub data: Data,
}

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
    pub titles: Option<WorkTitles>,
    pub creators: Option<Vec<Creator>>,
    pub work_year: Option<PublicationYear>,
    pub material_types: Option<Vec<MaterialType>>,
    #[serde(rename = "abstract")]
    pub r#abstract: Option<Vec<String>>,
    pub genre_and_form: Option<Vec<String>>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct WorkTitles {
    pub full: Option<Vec<String>>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PublicationYear {
    pub display: Option<String>,
    pub year: Option<i32>,
    pub end_year: Option<i32>,
    pub frequency: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Creator {
    pub display: Option<String>,
    pub roles: Option<Vec<Role>>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct MaterialType {
    pub specific: Option<String>,
    pub general: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Role {
    pub function_code: Option<String>,
    pub function: Option<Translation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Translation {
    pub singular: Option<String>,
}

pub async fn search_handler(request: Request) -> Result<Response<Body>, Error> {
    // Parse query parameters
    let query_string = request.uri().query().unwrap_or("");
    let query: SearchQuery = from_qs(query_string).unwrap();

    let offset = query.offset.unwrap_or(0);
    let limit: usize = query.limit.unwrap_or(12);

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
                    titles {{
                        full
                    }}
                    creators {{
                        display
                        roles {{
                            functionCode
                            function {{
                                singular
                            }}
                        }}
                    }}
                    workYear {{
                        display
                        year
                        endYear
                        frequency
                    }}
                    materialTypes {{
                        general
                        specific
                    }}
                    abstract
                    genreAndForm
                }}
            }}
        }}
        "#,
        query.q, offset, limit
    );

    let token_value = match access_token().await {
        Ok(token) => token,
        Err(e) => {
            eprintln!("Error retrieving token: {}", e);
            return Err(e.into());
        }
    };

    // Prepare the GraphQL request payload
    let graphql_request = serde_json::json!({
        "query": graphql_query,
    });

    let client = reqwest::Client::new();

    let response = client
        .post("https://fbi-api.dbc.dk/bibdk21/graphql")
        .bearer_auth(token_value)
        .json(&graphql_request)
        .send()
        .await?;

    let status = response.status();
    let response_text = response.text().await?;

    // Print the response body for debugging
    println!("Remove // in search_utils.rs to display search response JSON");
    //println!("Search Response Body: {}", response_text);

    // Check if the response is successful
    if !status.is_success() {
        eprintln!("GraphQL query failed with status {}: {}", status, response_text);
        return Err(Error::from(format!(
            "GraphQL query failed with status {}: {}",
            status, response_text
        )));
    }

    // Deserialize the response
    let response_data: Root = match serde_json::from_str(&response_text) {
        Ok(data) => data,
        Err(e) => {
            eprintln!("Deserialization error: {:?}", e);
            return Err(Error::from(format!(
                "Deserialization error: {:?}",
                e
            )));
        }
    };

    let data = response_data.data;

    let response_body = serde_json::to_string(&data).unwrap();

    let response = Response::builder()
        .status(200)
        .header("Content-Type", "application/json")
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Methods", "GET, OPTIONS")
        .header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        .body(Body::Text(response_body))
        .expect("Failed to render response");

    Ok(response)
}