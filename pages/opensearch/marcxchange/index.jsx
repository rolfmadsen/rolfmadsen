import React from "react";
import Layout from '../../../components/Layout';

function useOpenPlatformSearch(queryString) {
  const [SearchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState("false");

  const simplePhrase = queryString;
  const validCql = queryString.includes("phrase.") || queryString.includes("term.") || queryString.includes("rec.") || queryString.includes("holdingsitem.") || queryString.includes("dkcclphrase.") || queryString.includes("dkcclterm.") || queryString.includes("facet.") || queryString.includes("term.") ? queryString : simplePhrase;

  React.useEffect(() => {
    async function fetchBookList() {
      try {
        setLoading ("true");
        const response = await fetch(`/api/opensearch/search?searchquery=${validCql}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Charset': 'utf-8',
          },
        }

        );
        const json = await response.json();
        setSearchResult(json);
        console.log(json);
      } catch (error) {
        setLoading("null");
      }
    }

    if (queryString !== "") {
      fetchBookList();
    }
  }, [queryString]);

  return [SearchResult, loading];
}

function SearchResult() {
  const [userSearchRequest, setUserSearchRequest] = React.useState("");
  const [queryString, setQueryString] = React.useState("");
  const [SearchResult, loading] = useOpenPlatformSearch(queryString);

  return (
    <Layout>
      <form 
        className="flex w-full px-4"
        onSubmit={e => {
          e.preventDefault();
          setQueryString(userSearchRequest);
        }}
        >
        <input className="flex w-11/12 shadow border border-blue-300 rounded py-3 px-3 text-gray-700 mb-1 focus:outline-none focus:shadow-outline" 
        type="search" autoComplete="on" placeholder="Search for title, author or subject ..." id="searchquery" name="searchquery" autoFocus onChange={e => setUserSearchRequest(e.target.value)} />
        <button className="flex w-auto ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-full" type="submit">Search</button>
      </form>
      {loading === "false" ? (
          <div className="block relative border-solid border-2 border-gray-600 clear-both py-2 px-2 mx-5 my-5">
            <p className="block">When you perform a search this page will display a JSON response from the Opensearch service in the marcXchange format.</p>
          </div>
      ) : loading === "null" ? (
         <div>
          <p>No materials matched your search query ...</p>   
        </div>
      ) : (
        <div>
          <pre>
            <code>
              {JSON.stringify(SearchResult, null, 2)}
            </code>
          </pre>
        </div>
        )
        }
      </Layout>
    );
  }
export default SearchResult