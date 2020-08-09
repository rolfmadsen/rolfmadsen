from flask import Flask, render_template, request
import json
import requests
import base64
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

@app.route('/api/openplatform/search', methods=['GET'])

def get_query_string():

    ACCESS_PLATFORM_ACCESS_TOKEN_CLIENT = os.getenv('ACCESS_PLATFORM_ACCESS_TOKEN_CLIENT', "Missing environment variable")
    query = request.args.get('searchquery')
    search_query = "{}".format(query)

    endpoint = "https://openplatform.dbc.dk/v3/search?"
    parameters = {
        "q": search_query,
        "access_token": ACCESS_PLATFORM_ACCESS_TOKEN_CLIENT,
        "fields": ["title", "pid", "creator", "date", "abstract", "titleSeries", "type", "identifierUPC", "workType"],
        "pretty": "true",
        "timings": "true",
        "offset": "0",
        "limit": "50"
    }

    # https://openplatform.dbc.dk/v3/search?fields=pid,title,creator,abstract,titleSeries,type,identifierUPC&access_token={ACCESS_PLATFORM_ACCESS_TOKEN_CLIENT}&pretty=true&timings=true&q={search_query}&offset=0&limit=50
    response = requests.get(
        url = endpoint,
        params = parameters,
        )
    
    print(response.url)
    
    response_json = response.json()
    return response_json