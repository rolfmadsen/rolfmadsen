import React from "react";

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

function OpensearchMarcxchange() {
  const [userSearchRequest, setUserSearchRequest] = React.useState("");
  const [queryString, setQueryString] = React.useState("");
  const [SearchResult, loading] = useOpenPlatformSearch(queryString);

  return (
    <div>
      <form 
        className="flex w-full px-4"
        onSubmit={e => {
          e.preventDefault();
          setQueryString(userSearchRequest);
        }}
      >
          <input className="flex w-11/12 border-solid border-2 border-gray-600 rounded py-3 px-3 text-gray-700 mb-1 focus:outline-none focus:shadow-outline" 
          type="search" placeholder="Search for titles, authors or subjects ..." id="searchquery" name="searchquery" autoComplete="on" autoFocus onChange={e => setUserSearchRequest(e.target.value)} />
          <button className="ml-4 bg-green-600 hover:bg-green-400 text-white rounded-full py-2 px-6 font-semibold" type="submit">Search</button>
      </form>
      {loading === "false" ? (
          <div className="block relative border-solid border-2 border-gray-600 clear-both py-2 px-2 mx-4 my-4">
            <p className="block">WARNING! This site contains experiments and early prototypes.</p>
            <p className="block">When you perform a search this page will display a JSON response from the Opensearch service in the marcXchange format.</p>
          </div>
      ) : loading === "null" ? (
         <div>
          <p>No materials matched your search query ...</p>   
        </div>
      ) : (
        <div>
          <pre className="border-solid border-black border-2 border-opacity-25 mx-4 my-2">
            <code>
              {JSON.stringify(SearchResult, null, 2)}
            </code>
          </pre>
        </div>
        )
      }
    </div>
  );
}
export default OpensearchMarcxchange