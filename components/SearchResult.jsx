import React from "react";

function useOpenPlatformSearch(queryString) {
  const [SearchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState("false");

  const simplePhrase = "'" + queryString + "'";
  const validCql = queryString.includes("phrase.") || queryString.includes("term.") || queryString.includes("rec.") || queryString.includes("holdingsitem.") || queryString.includes("dkcclphrase.") || queryString.includes("dkcclterm.") || queryString.includes("facet.") || queryString.includes("term.") ? queryString : simplePhrase;

  React.useEffect(() => {
    async function fetchBookList() {
      try {
        setLoading ("true");
        const response = await fetch(
          //`https://openplatform.dbc.dk/v3/search?q=${validCql}&fields=title&fields=date&fields=creator&fields=workType&fields=abstract&fields=pid&access_token=${process.env.NEXT_PUBLIC_ACCESS_PLATFORM_ACCESS_TOKEN_CLIENT}&offset=0&limit=25&timings=true&sort=rank_frequency`
          `api/openplatform/search?searchquery=${validCql}`
        );
        const json = await response.json();
        setSearchResult(
          json.data.map(workCollection => {
            return workCollection;
          })
        );
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
    <div>
      <form 
        className="flex w-full px-4"
        autoComplete="on"
        onSubmit={e => {
          e.preventDefault();
          setQueryString(userSearchRequest);
        }}
      >
          <input className="flex w-11/12 border-solid border-2 border-gray-600 rounded py-3 px-3 text-gray-700 mb-1 focus:outline-none focus:shadow-outline" type="search" placeholder="Search for title, author or subject ..." id="searchquery" name="searchquery" autoFocus onChange={e => setUserSearchRequest(e.target.value)} />
          <button className="ml-4 bg-green-600 hover:bg-green-400 text-white rounded-full py-2 px-6 font-semibold" type="submit">Search</button>
      </form>
      
      {loading === "false" ? (
          <div className="block relative border-solid border-2 border-gray-600 clear-both py-2 px-2 mx-4 my-4">
            <p className="block">WARNING! This site contains experiments and early prototypes.</p>
          </div>
      ) : loading === "null" ? (
         <div>
          <p className="border-solid border-black border-2">No materials matched your search query ...</p>
        </div>
      ) : (
        SearchResult.map(workCollection => {
          const orderBibliotekdkLink = "https://bibliotek.dk/da/reservation?ids=" + workCollection.pid + "&subtype_order_ids= + workCollection.pid";
          // https://bibliotek.dk/linkme.php?rec.id=870970-basis%3A29750947
          // https://bibliotek.dk/da/reservation?ids=870970-basis%3A29750947&subtype_order_ids=870970-basis%3A29750947
          return <article id="workCollection" className="border-solid border-black border-2 border-opacity-25 mx-4 my-2">
            <div id="workCollection_header" className="p-4 rounded bg-white">
              {workCollection.title ? 
                <span title="Title">
                  <strong>
                    {workCollection.title}
                  </strong>
                </span> : ""}
              
              {workCollection.titleSeries ? 
                <span title="Title of series">
                  <strong>
                    {workCollection.titleSeries}
                  </strong>
                </span>
              : ""}
              
              {workCollection.date ? 
                <span title="publication year (date)">
                  {` (${workCollection.date}) `}
                </span>
              : ""}

              {workCollection.creator ? 
                <span title="Creator">
                  {` by ${workCollection.creator}`}
                </span>
              : ""}

            </div>
            <div id="workCollection_abstract">
              {workCollection.abstract ?
                <span className="px-4 pb-4 inline-block" title ="abstract">{workCollection.abstract} </span> : ""
              }
            </div>             
            <div id="workCollection_order" className="pb-4">
              <a href={orderBibliotekdkLink}><button className="ml-3 bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-lg" id="button" title={`Order the ${workCollection.workType} with PID ${workCollection.pid} at Bibliotek.dk`}>Order</button> </a>
            </div>
          </article>;
        })
      )}
      <details className="px-4">
        <summary>ReactJS states:</summary>
        <ul>
          <li>userSearchRequest: {userSearchRequest}</li>
          <li>queryString: {queryString}</li>
          <li>loading: {loading}</li>
        </ul>
      </details> 
    </div>
  );
}
export default SearchResult