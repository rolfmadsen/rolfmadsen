import React from "react";
import Layout from '../../components/Layout';

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
    <Layout>
      <form 
        className="flex w-full px-4"
        autoComplete="on"
        onSubmit={e => {
          e.preventDefault();
          setQueryString(userSearchRequest);
        }}
      >
          <input className="flex w-11/12 shadow border border-blue-300 rounded py-3 px-3 text-gray-700 mb-1 focus:outline-none focus:shadow-outline" type="search" placeholder="Search for title, author or subject ..." id="searchquery" name="searchquery" autoFocus onChange={e => setUserSearchRequest(e.target.value)} />
          <button className="flex w-auto ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-full" type="submit">Search</button>
      </form>
      <details className="px-4">
        <summary className="">ReactJS states:</summary>
        <ul className="">
          <li className="">userSearchRequest: {userSearchRequest}</li>
          <li>queryString: {queryString}</li>
          <li>loading: {loading}</li>
        </ul>
      </details> 
      
      {loading === "false" ? (
        <p className="border-solid border-black border-2 p-4 m-4 text-center">Enter your search query in the search field ...</p>
      ) : loading === "null" ? (
         <div>
          <p className="border-solid border-black border-2">No materials matched your search query ...</p>
        </div>
      ) : (
        SearchResult.map(workCollection => {
          const orderBibliotekdkLink = "https://bibliotek.dk/da/reservation?ids=" + workCollection.pid + "&subtype_order_ids= + workCollection.pid";
          // https://bibliotek.dk/linkme.php?rec.id=870970-basis%3A29750947
          // https://bibliotek.dk/da/reservation?ids=870970-basis%3A29750947&subtype_order_ids=870970-basis%3A29750947
          return <article id="workCollection">
            <div id="workCollection_header" className="p-4 shadow rounded bg-white">
              <br />
              {workCollection.title ?
                <span title="Title"><strong>{workCollection.title} </strong></span>
                :
                ""
              }
              {workCollection.titleSeries ?
                <span title="Title of series"><strong>{workCollection.titleSeries} </strong></span>
                :
                ""
              }
              {workCollection.date ?
                <span title="publication year (date)">{workCollection.date ? "(" + workCollection.date + ")" : ""} </span>
                :
                ""
              }
              {workCollection.creator ?
                <span title="Creator">{workCollection.creator ? "by " + workCollection.creator : ""} </span>
                :
                ""
              }
            </div>
            {workCollection.abstract ? 
              <span title ="abstract"><i>{workCollection.abstract}</i> </span>
              : 
              ""
              }             
            <div id="workCollection_order">
              <span title={workCollection.pid}>{workCollection.workType} </span>
              <a href={orderBibliotekdkLink}><button className="ml-3 bg-orange-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" id="button" title={"Order PID " + workCollection.pid + " at Bibliotek.dk"}>Order</button> </a>
            </div>
          </article>;
        })
      )}
    </Layout>
  );
}
export default SearchResult