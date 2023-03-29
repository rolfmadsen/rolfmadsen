import React from "react";

function useOpenPlatformSearch(queryString, currentPage, pageSize) {
  const [searchResult, setSearchResult] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const validCql = queryString.includes("phrase.") || queryString.includes("term.") || queryString.includes("rec.") || queryString.includes("holdingsitem.") || queryString.includes("dkcclphrase.") || queryString.includes("dkcclterm.") || queryString.includes("facet.") || queryString.includes("term.") ? queryString : queryString;

  React.useEffect(() => {
    async function fetchBookList() {
      try {
        setLoading(true);
        const start = (currentPage - 1) * pageSize; // calculate the start value
        const response = await fetch(`/api/opensearch/search?searchquery=${validCql}&start=${start}&stepValue=${pageSize}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Charset': 'utf-8',
          },
        });

        const json = await response.json();
        setSearchResult(json);
      } catch (error) {
        setLoading(null);
      }
    }

    if (queryString !== "") {
      fetchBookList();
    }
  }, [queryString, currentPage, pageSize]);

  return [searchResult, loading];
}


function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center items-center">
      {currentPage > 1 && (
        <button
          className="bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
      )}
      <p className="mx-4">
        Page {currentPage} of {totalPages}
      </p>
      {currentPage < totalPages && (
        <button
          className="bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      )}
    </div>
  );
}


function Opensearch() {
  const [userSearchRequest, setUserSearchRequest] = React.useState("");
  const [queryString, setQueryString] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchResult, loading] = useOpenPlatformSearch(queryString, currentPage, pageSize);

  const hitCount = parseInt(searchResult.searchResponse?.result?.hitCount?.$);
  const totalPages = Math.ceil(hitCount / pageSize);

  return (
    <div>
      <div className="pb-20">
        <form
          className="flex w-full px-4"
          onSubmit={e => {
            e.preventDefault();
            setQueryString(userSearchRequest);
            setCurrentPage(1);
          }}
        >
          <input className="flex w-11/12 border-solid border-2 border-gray-600 rounded py-3 px-3 text-gray-700 mb-1 focus:outline-none focus:shadow-outline" type="search" placeholder="Search for titles, authors or subjects ..." id="searchquery" name="searchquery" autoComplete="on" autoFocus onChange={e => setUserSearchRequest(e.target.value)} />
          <button className="ml-4 bg-green-600 hover:bg-green-400 text-white rounded-full py-2 px-6 font-semibold" type="submit">Search</button>
        </form>
        {loading === false ? (
          <div className="block relative border-solid border-2 border-gray-600 clear-both py-2 px-2 mx-4 my-4">
          <p className="block text-center">WARNING! This site contains experiments and early prototypes.</p>
          <br />
          <p className="block text-center">When you perform a search this page will display a search result from the Opensearch test service at https://opensearch.addi.dk/test_5.2/.</p>
        </div>
      ) : loading === null ? (
        <div>
          <p>No materials matched your search query ...</p>
        </div>
      ) : (
        <div>
          <div className="mx-4 my-2">
            {searchResult.searchResponse?.result?.searchResult?.map((result, index) => {
              const record = result.collection.object[0].record;
              const title = record.title?.find(t => t["@type"]?.["$"] === "dkdcplus:full")?.$;
              const creator = record.creator?.find(c => c["@type"]?.["$"] === "dkdcplus:aut")?.$;
              const date = record.date?.[0]?.$;
              const type = record.type?.[0]?.$;
              const language = record.language?.[1]?.$;
              const identifier = result.collection.object[0].identifier?.$;
  
              const loanLink = `https://bibliotek.dk/linkme.php?rec.id=${encodeURIComponent(identifier)}`;
  
              return (
                <div key={index} className="bg-white border-2 border-gray-300 p-6 rounded-md tracking-wide shadow-lg mb-4">
                  <h2 className="text-xl font-bold mb-2">{title}</h2>
                  <p className="text-md font-semibold mb-2">{creator} {date}</p>
                  <p className="text-sm font-medium mb-4">{type} ({language})</p>
                  <a href={loanLink} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Loan
                  </a>
                </div>
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  </div>
  );
}

export default Opensearch;