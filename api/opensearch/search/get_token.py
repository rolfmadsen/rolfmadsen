import json
import time
import requests
from bs4 import BeautifulSoup
import graphqlclient

class ApiClient:
    def __init__(self):
        self.token = None
        self.token_expires = 0

    def get_token(self):
        if not self.token or time.time() > self.token_expires:
            self.token = self.get_beta_bibliotek_dk_bearer_token()
            self.token_expires = time.time() + 3600  # Assuming token expires in 1 hour
        return self.token

    def get_beta_bibliotek_dk_bearer_token(self):
        response = requests.get("https://beta.bibliotek.dk/find")
        soup = BeautifulSoup(response.text, "html.parser")
        script_tag = soup.find("script", {"id": "__NEXT_DATA__"})
        data = json.loads(script_tag.string)
        access_token = data["props"]["pageProps"]["session"]["accessToken"]
        return access_token

    def query(self, query):
        endpoint = "https://fbi-api.dbc.dk/bibdk21/graphql"
        token = self.get_token()
        print(token)
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        }

        client = graphqlclient.GraphQLClient(endpoint)
        for header_name, header_value in headers.items():
            client.inject_token(header_value, header_name)

        response = client.execute(query)
        response_data = json.loads(response)
        return response_data

def main():
    query = """
    query search {
        search(
            q: { all: "harry potter" }
            filters: {}
        ) {
            hitcount
            works(offset: 0, limit: 2) {
                workId
                abstract
            }
        }
    }
    """

    api_client = ApiClient()
    response_data = api_client.query(query)
    data = response_data['data']

    print(json.dumps(data, indent=2))

    print("Hitcount:", data['search']['hitcount'])
    print("Work ID:", data['search']['works'][0]['workId'])
    print("Work Abstract:", data['search']['works'][0]['abstract'])

if __name__ == "__main__":
    main()
