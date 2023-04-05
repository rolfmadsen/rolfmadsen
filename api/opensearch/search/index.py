from flask import Flask, request
import json
import requests

app = Flask(__name__)

@app.route('/api/opensearch/search', methods=['GET'])
def get_query_string():
    query = request.args.get('searchquery')
    query_string = "'{}'".format(query)
    objectFormat = 'dkabm'
    step_value = request.args.get('stepValue', default=10, type=int)
    start = request.args.get('start', default=1, type=int)

    search_response = getsearchresult(query_string, objectFormat, start, step_value)
    return search_response

   
def getsearchresult(search_query, objectFormat, start, stepValue):
    parameters = {
        'action': 'search',
        'query': search_query,
        'agency': '100200',
        'profile': 'test',
        'start': start,
        'stepValue': stepValue,
        'outputType': 'json',
        'relationData': 'full',
        'objectFormat': objectFormat,
        'collectionType': 'manifestation'
    }

    endpoint = 'https://opensearch.addi.dk/test_5.2/'

    response = requests.get(
        url=endpoint,
        params=parameters,
    )

    print(response.url)
    response_dict = response.json()
    response_json = json.dumps(response_dict, ensure_ascii=False)

    return response_json