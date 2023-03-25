import React, { useState, useEffect } from "react";

function useOpenSearch(queryString) {
  const [SearchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState("false");

  const simplePhrase = queryString;
  const validCql = queryString.includes("phrase.") || queryString.includes("term.") || queryString.includes("rec.") || queryString.includes("holdingsitem.") || queryString.includes("dkcclphrase.") || queryString.includes("dkcclterm.") || queryString.includes("facet.") || queryString.includes("term.") ? queryString : simplePhrase;

  useEffect(() => {
    async function fetchOpenSearchResults() {
      try {
        setLoading ("true");
        const response = await fetch(`/api/opensearch/search?searchquery=${validCql}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json', 'Accept-Charset': 'utf-8', },
          }
        );
        const json = await response.json();
        setSearchResult(
          json.searchResponse.result.searchResult.map(workCollection => {
            return workCollection;
          })
        );
        console.log(setSearchResult);
      } catch (error) {
        setLoading("null");
      }
    }

    if (queryString !== "") {
      fetchOpenSearchResults();
    }
  }, [queryString]);

  return [SearchResult, loading];
}

  function SearchResult() {
    const [userSearchRequest, setUserSearchRequest] = useState("");
    const [queryString, setQueryString] = useState("");
    const [SearchResult, loading] = useOpenSearch(queryString);

    return (
      <div>
        <form 
          className="flex w-full px-4"
          autoComplete="on"
          onSubmit={e => {
            e.preventDefault();
            setQueryString(userSearchRequest);
          }}
        >
            <input className="flex w-11/12 border-solid border-2 border-gray-600 rounded py-3 px-3 text-gray-700 mb-1 focus:outline-none focus:shadow-outline" type="search" placeholder="Search for titles, authors or subjects ..." id="searchquery" name="searchquery" autoFocus onChange={e => setUserSearchRequest(e.target.value)} />
            <button className="ml-4 bg-green-600 hover:bg-green-400 text-white rounded-full py-2 px-6 font-semibold" type="submit">Search</button>
        </form>
        
        {loading === "false" ? (
            <div className="block relative border-solid border-2 border-gray-600 clear-both py-2 px-2 mx-4 my-4">
              <p className="block">WARNING! This site contains experiments and early prototypes.</p>
              <p className="block">This search result only works with an activated access token, which is not the case at the moment.</p>
            </div>
          ) : loading === "null" ? (
            <div>
              <p className="border-solid border-black border-2">No materials matched your search query ...</p>
            </div>
          ) : (
            SearchResult.map(workCollection => {
              return <article id="workCollection" className="border-solid border-black border-2 border-opacity-25 mx-4 my-2">
                <div id="workCollection_header" className="p-4 rounded bg-white">
                  {workCollection.title ? 
                    <span key="worktitle" title="Title">
                      <strong>
                        {workCollection.title[0].$}
                      </strong>
                    </span> : ""}
                  {workCollection.creator ? 
                    <span key="workcreator" title="Forfatter">
                      <strong>
                        {workCollection.creator[0].$}
                      </strong>
                    </span> : ""}
                </div>  
              </article>;
            })
        )}
      </div>
    );
  }

export default SearchResult