// api/work.rs

use vercel_runtime::{run, Body, Error, Request, Response};
#[cfg(debug_assertions)]
use dotenv::dotenv; // Import dotenv to load environment variables (for debug mode)
use rolfmadsen::modules::work_utils::work_handler;
use std::error::Error as StdError;

#[tokio::main]
async fn main() -> Result<(), Box<dyn StdError + Send + Sync>> {
    #[cfg(debug_assertions)]
    {
        dotenv().ok();
    }
    run(handler).await
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    work_handler(req).await
}