import React from "react";

function useOpenPlatformSearch(queryString) {
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const validCql = queryString.includes("phrase.") || queryString.includes("term.") || queryString.includes("rec.") || queryString.includes("holdingsitem.") || queryString.includes("dkcclphrase.") || queryString.includes("dkcclterm.") || queryString.includes("facet.") || queryString.includes("term.") ? queryString : queryString;

  React.useEffect(() => {
    async function fetchBookList() {
      try {
        setLoading(true);
        const response = await fetch(`/api/opensearch/search?searchquery=${validCql}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Charset': 'utf-8',
          },
        });

        const json = await response.json();
        setSearchResult(json);
        console.log(json);
      } catch (error) {
        setLoading(null);
      }
    }

    if (queryString !== "") {
      fetchBookList();
    }
  }, [queryString]);

  return [searchResult, loading];
}

function Opensearch() {
  const [userSearchRequest, setUserSearchRequest] = React.useState("");
  const [queryString, setQueryString] = React.useState("");
  const [searchResult, loading] = useOpenPlatformSearch(queryString);

  return (
    <div>
      <div className="pb-20">
        <form
          className="flex w-full px-4"
          onSubmit={e => {
            e.preventDefault();
            setQueryString(userSearchRequest);
          }}
        >
          <input className="flex w-11/12 border-solid border-2 border-gray-600 rounded py-3 px-3 text-gray-700 mb-1 focus:outline-none focus:shadow-outline" type="search" placeholder="Search for titles, authors or subjects ..." id="searchquery" name="searchquery" autoComplete="on" autoFocus onChange={e => setUserSearchRequest(e.target.value)} />
          <button className="ml-4 bg-green-600 hover:bg-green-400 text-white rounded-full py-2 px-6 font-semibold" type="submit">Search</button>
        </form>
        {loading === false ? (
          <div className="block relative border-solid border-2 border-gray-600 clear-both py-2 px-2 mx-4 my-4">
            <p className="block">WARNING! This site contains experiments and early prototypes.</p>
            <p className="block">When you perform a search this page will display a JSON response from the Opensearch service.</p>
          </div>
        ) : loading === null ? (
          <div>
            <p>No materials matched your search query ...</p>
          </div>
        ) : (
          <div>
            {/* ... JSON output JSX */}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Opensearch;