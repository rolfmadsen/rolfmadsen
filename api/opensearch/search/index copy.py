from flask import Flask, render_template, request
import json
import requests

app = Flask(__name__)

@app.route('/api/opensearch/search', methods=['GET'])

def get_query_string():
    query = request.args.get('searchquery')
    query_string = "'{}'".format(query)
    objectFormat = 'dkabm'
    
    search_response = getsearchresult(query_string, objectFormat)
    return search_response
   
def getsearchresult(search_query, objectFormat):

    parameters = {
        'action':'search',
        'query':search_query,
        'agency':'100200',
        'profile':'test',
        'start':'1',
        'stepValue':'10',
        'outputType':'json',
        'objectFormat':objectFormat,
        'collectionType':'manifestation'
      }

    endpoint = 'https://opensearch.addi.dk/test_5.2/?'
    
    # https://opensearch.addi.dk/test_5.2/?action=search&query=%22peter%22&agency=100200&profile=test&start=1&stepValue=10&outputType=json&objectFormat=dkabm

    response = requests.get(
        url=endpoint, 
        params=parameters,
        )
    response_dict = response.json()
    response_json = json.dumps(response_dict, ensure_ascii=False)

    return response_json
