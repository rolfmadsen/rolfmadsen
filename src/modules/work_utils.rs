// src/modules/work_utils.rs

use vercel_runtime::{Body, Error, Request, Response};
use serde::{Deserialize, Serialize};
use serde_qs::from_str as from_qs;
use crate::modules::utils::access_token;
use reqwest;

#[derive(Deserialize)]
struct WorkQuery {
    id: String,
}

// Define data structures
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Root {
    pub data: Option<Data>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Data {
    pub work: Option<Work>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Work {
    #[serde(rename = "workId")]
    pub work_id: String,
    pub titles: Option<Titles>,
    #[serde(rename = "abstract")]
    pub abstract_text: Option<Vec<String>>,
    pub creators: Option<Vec<Creator>>,
    pub subjects: Option<Subjects>,
    pub work_year: Option<WorkYear>,
    pub work_types: Option<Vec<String>>,
    pub main_languages: Option<Vec<Language>>,
    pub manifestations: Option<Manifestations>,
    pub dk5_main_entry: Option<Dk5MainEntry>,
    pub material_types: Option<Vec<MaterialType>>,
    pub genre_and_form: Option<Vec<String>>,
    pub fiction_nonfiction: Option<FictionNonfiction>,
    pub latest_publication_date: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Titles {
    pub full: Option<Vec<String>>,
    pub main: Option<Vec<String>>,
    pub translated: Option<Vec<String>>,
    pub original: Option<Vec<String>>,
    pub standard: Option<String>,
    pub title_plus_language: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Creator {
    pub display: Option<String>,
    pub name_sort: Option<String>,
    pub roles: Option<Vec<Role>>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Role {
    pub function_code: Option<String>,
    pub function: Option<Function>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Function {
    pub singular: Option<String>,
    pub plural: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Subjects {
    #[serde(rename = "dbcVerified")]
    pub dbc_verified: Option<Vec<Subject>>,
    pub all: Option<Vec<Subject>>, // Ensure to include 'all' if it's used in your GraphQL query
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Subject {
    pub display: Option<String>,
    pub language: Option<Language>,
    #[serde(rename = "type")]
    pub subject_type: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Language {
    pub display: Option<String>,
    #[serde(rename = "isoCode")]
    pub iso_code: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkYear {
    pub year: Option<i32>,
    #[serde(rename = "endYear")]
    pub end_year: Option<i32>,
    pub frequency: Option<String>,
    pub display: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Manifestations {
    pub all: Option<Vec<All>>,
    pub latest: Option<Latest>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct All {
    pub pid: Option<String>,
    pub titles: Option<Titles>,
    //pub cover: Option<Cover>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Latest {
    pub pid: Option<String>,
    pub titles: Option<Titles>,
    //pub cover: Option<Cover>,
}

/*
#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Cover {
    pub detail: Option<String>,
}
*/

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Dk5MainEntry {
    pub display: Option<String>,
    pub code: Option<String>,
    #[serde(rename = "dk5Heading")]
    pub dk5_heading: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MaterialType {
    pub material_type_general: Option<MaterialTypeGeneral>,
    pub material_type_specific: Option<MaterialTypeSpecific>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MaterialTypeGeneral {
    pub code: Option<String>,
    pub display: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MaterialTypeSpecific {
    pub code: Option<String>,
    pub display: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Member {
    pub work: Option<WorkSummary>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkSummary {
    #[serde(rename = "workId")]
    pub work_id: Option<String>,
    pub titles: Option<Titles>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FictionNonfiction {
    pub display: Option<String>,
    pub code: Option<String>,
}

pub async fn work_handler(request: Request) -> Result<Response<Body>, Error> {
    // Parse query parameters
    let query_string = request.uri().query().unwrap_or("");
    let query: WorkQuery = from_qs(query_string).unwrap();

    let work_id = query.id;

    let graphql_query = r#"
        query ($id: String!) {
            work(id: $id) {
                workId
                titles {
                    main
                    full
                    translated
                    original
                    standard
                    titlePlusLanguage
                }
                abstract
                creators {
                    display
                    nameSort
                    roles {
                        functionCode
                        function {
                            singular
                            plural
                        }
                    }
                }
                dk5MainEntry {
                    display
                    code
                    dk5Heading
                }
                fictionNonfiction {
                    display
                    code
                }
                latestPublicationDate
                materialTypes {
                    materialTypeGeneral {
                        code
                        display
                    }
                    materialTypeSpecific {
                        code
                        display
                    }
                }
                subjects {
                    all {
                        display
                        type
                        language {
                            display
                        }
                    }
                }
                genreAndForm
                workTypes
                workYear {
                    display
                    year
                }
                mainLanguages {
                    display
                    isoCode
                }
                manifestations {
                    all {
                        pid
                        titles {
                            main
                        }
                        cover {
                            detail
                        }
                    }
                    latest {
                        pid
                        titles {
                            main
                        }
                        cover {
                            detail
                        }
                    }
                }
            }
        }
    "#;

    let variables = serde_json::json!({
        "id": work_id
    });

    let token_value = match access_token().await {
        Ok(token) => token,
        Err(e) => {
            eprintln!("Error retrieving token: {}", e);
            return Err(Error::from(format!("Error retrieving token: {}", e)));
        }
    };

    let client = reqwest::Client::new();

    let response = client
        .post("https://fbi-api.dbc.dk/bibdk21/graphql")
        .bearer_auth(token_value)
        .json(&serde_json::json!({
            "query": graphql_query,
            "variables": variables
        }))
        .send()
        .await?;

    let status = response.status();
    let response_text = response.text().await?;

    // Print the response body for debugging
    println!("Remove // in work_utils.rs to display work response JSON");
    println!("WorkResponse Body: {}", response_text);

    // Check if the response is successful
    if !status.is_success() {
        let error_message = format!("GraphQL query failed with status {}: {}", status, response_text);
        eprintln!("{}", error_message);
        return Err(Error::from(error_message));
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