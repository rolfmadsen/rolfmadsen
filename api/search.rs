use serde_derive::{Deserialize, Serialize};
use std::collections::HashMap;
use std::error::Error;
use std::sync::Mutex;
use lazy_static::lazy_static;
use vercel_runtime::{run, Body, Request, Response, StatusCode};
use serde_qs::from_str as from_qs;
use reqwest;
use std::env;
use dotenv::dotenv;

#[derive(Deserialize)]
struct SearchQuery {
    q: String,
    offset: Option<usize>,
    limit: Option<usize>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Root {
    pub data: Data,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Data {
    pub search: Search,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Search {
    pub hitcount: i64,
    pub works: Vec<Work>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Work {
    #[serde(rename = "workId")]
    pub work_id: String,
    pub titles: WorkTitles,
    #[serde(rename = "workYear")]
    pub work_year: Option<PublicationYear>,
    pub creators: Vec<Creator>,
    #[serde(rename = "materialTypes")]
    pub material_types: Option<Vec<MaterialType>>,
    #[serde(rename = "abstract")]
    pub r#abstract: Option<Vec<String>>,
    #[serde(rename = "genreAndForm")]
    pub genre_and_form: Option<Vec<String>>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkTitles {
    pub full: Option<Vec<String>>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PublicationYear {
    pub display: Option<String>,
    pub year: Option<i32>,
    pub end_year: Option<i32>,
    pub frequency: Option<String>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Creator {
    pub display: Option<String>,
    pub roles: Option<Vec<Role>>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MaterialType {
    pub specific: Option<String>,
    pub general: Option<String>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Role {
    #[serde(rename = "functionCode")]
    pub function_code: String,
    pub function: Translation,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Translation {
    pub singular: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error + Send + Sync>> {
    #[cfg(debug_assertions)]
    {
        dotenv().ok(); // Only load .env in development
    }
    run(index_handler).await?;
    Ok(())
}

/*
async fn access_token() -> Result<String, Box<dyn Error + Send + Sync>> {
    match env::var("ACCESS_TOKEN_ENVIRONMENT_VARIABLE") {
        Ok(token) => Ok(token),
        Err(e) => Err(Box::new(e)),
    }
}
*/

async fn index_handler(request: Request) -> Result<Response<Body>, Box<dyn Error + Send + Sync>> {
    let query: SearchQuery = from_qs(request.uri().query().unwrap_or("")).unwrap();
    let offset = query.offset.unwrap_or(0); // default to 0 if not provided
    let limit: usize = query.limit.unwrap_or(12); // default to 12 if not provided
    let query = format!(r#"
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
    "#, query.q, offset, limit);   

    let token_value = match access_token().await {
        Ok(token) => token,
        Err(e) => {
            eprintln!("Error retrieving token: {}", e);
            return Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "Error retrieving token")));
        }
    };
    println!("Access token: {}", token_value);

    let mut headers = HashMap::new();
    headers.insert("Content-type".to_string(), "application/json".to_string());     
    headers.insert("authorization".to_string(), token_value);
    let client = gql_client::Client::new_with_headers("https://fbi-api.dbc.dk/bibdk21/graphql", headers);

    let response = match client.query(&query).await {
        Ok(r) => r,
        Err(_e) => {
            return Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "Error querying API")));
        }
    };

    let data: Data = serde_json::from_value(response.unwrap()).map_err(|e| Box::new(e))?;

    let response_body = serde_json::to_string(&data).unwrap();
    let response = Response::builder()
        .status(StatusCode::OK)
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Methods", "GET, OPTIONS")
        .header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        .body(Body::from(response_body))?;

    Ok(response)
}

lazy_static! {
    static ref TOKEN: Mutex<Option<String>> = Mutex::new(None);
}

#[derive(Deserialize)]
struct TokenResponse {
    access_token: String,
    // Add other fields from the response if necessary
}

async fn fetch_access_token() -> Result<String, Box<dyn Error + Send + Sync>> {
    let client_id = env::var("NEXT_PUBLIC_FBI_API_CLIENT_ID").expect("FBI_API_CLIENT_ID not set");
    let client_secret = env::var("NEXT_PUBLIC_FBI_API_CLIENT_PASSWORD").expect("FBI_API_CLIENT_PASSWORD not set");

    let params = [("grant_type", "password"), ("username", "@"), ("password", "@")];
    let client = reqwest::Client::new();

    let response = client.post("https://auth.dbc.dk/oauth/token")
        .basic_auth(client_id, Some(client_secret))
        .form(&params)
        .send()
        .await?;

    if !response.status().is_success() {
        // Return a custom error for non-successful HTTP response
        let error_message = format!("Failed to fetch access token: HTTP {}", response.status());
        return Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, error_message)));
    }

    let token_response = response.json::<TokenResponse>().await?;
    Ok(token_response.access_token)
}

async fn access_token() -> Result<String, Box<dyn Error + Send + Sync>> {
    let mut token_guard = TOKEN.lock().unwrap();
    if let Some(token) = &*token_guard {
        return Ok(token.clone());
    }

    let token = fetch_access_token().await?;
    *token_guard = Some(token.clone());

    Ok(token)
}