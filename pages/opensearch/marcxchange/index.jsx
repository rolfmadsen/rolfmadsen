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
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={e => {
          e.preventDefault();
          setQueryString(userSearchRequest);
        }}
        >
        <input className="shadow appearance-none border border-grey-750 rounded w-5/6 py-3 px-3 text-gray-700 mb-1 focus:outline-none focus:shadow-outline" 
        type="search" autoComplete="on" placeholder="Search for title, author or subject ..." id="searchquery" name="searchquery" autoFocus onChange={e => setUserSearchRequest(e.target.value)} />
        <button className="ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" type="submit">Search</button>
      </form>
      {loading === "false" ? (
        <p>Enter your search query in the search field ...</p>
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