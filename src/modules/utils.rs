// src/modules/utils.rs

use std::env;
use std::error::Error as StdError;
use std::sync::Mutex;
use reqwest;
use lazy_static::lazy_static;
use serde_derive::Deserialize;

lazy_static! {
    static ref TOKEN: Mutex<Option<String>> = Mutex::new(None);
}

#[derive(Deserialize)]
struct TokenResponse {
    access_token: String,
}

async fn fetch_access_token() -> Result<String, Box<dyn StdError + Send + Sync>> {
    let client_id = env::var("NEXT_PUBLIC_FBI_API_CLIENT_ID").expect("FBI_API_CLIENT_ID not set");
    let client_secret = env::var("NEXT_PUBLIC_FBI_API_CLIENT_PASSWORD").expect("FBI_API_CLIENT_PASSWORD not set");

    let params = [
        ("grant_type", "password"),
        ("username", "@"),
        ("password", "@"),
    ];

    let client = reqwest::Client::new();

    let response = client
        .post("https://auth.dbc.dk/oauth/token")
        .basic_auth(client_id, Some(client_secret))
        .form(&params)
        .send()
        .await?;

    if !response.status().is_success() {
        let status = response.status();
        let error_text = response.text().await.unwrap_or_default();
        let error_message = format!("Token fetch failed with status {}: {}", status, error_text);
        eprintln!("{}", error_message);
        return Err(std::io::Error::new(std::io::ErrorKind::Other, error_message).into());
    }

    let token_response = response.json::<TokenResponse>().await?;
    
    // Print token when fetched
    eprintln!("Fetched Access Token: {}", token_response.access_token);

    Ok(token_response.access_token)
}

pub async fn access_token() -> Result<String, Box<dyn StdError + Send + Sync>> {
    let mut token_guard = TOKEN.lock().unwrap();
    if let Some(token) = &*token_guard {
        eprintln!("Cached Access Token: {}", token);
        return Ok(token.clone());
    }

    let token = fetch_access_token().await?;
    eprintln!("Newly Fetched Access Token: {}", token);

    *token_guard = Some(token.clone());

    Ok(token)
}