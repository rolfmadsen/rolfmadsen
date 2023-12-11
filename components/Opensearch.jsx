import React from "react";
import { useRouter } from 'next/router';

function useOpenPlatformSearch(queryString, currentPage, pageSize) {
  const [searchResult, setSearchResult] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const prevQueryString = React.useRef(queryString);
  const prevCurrentPage = React.useRef(currentPage);
  const prevPageSize = React.useRef(pageSize);

  React.useEffect(() => {
    if (
      prevQueryString.current === queryString &&
      prevCurrentPage.current === currentPage &&
      prevPageSize.current === pageSize
    ) {
      return;
    }

    prevQueryString.current = queryString;
    prevCurrentPage.current = currentPage;
    prevPageSize.current = pageSize;

    async function fetchBookList() {
      try {
        setLoading(true);
        const start = (currentPage - 1) * pageSize; // calculate the start value
        const response = await fetch(`/api/search?q=${queryString}&offset=${start}&limit=${pageSize}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Charset': 'utf-8',
          },
        });

        const json = await response.json();
        setSearchResult(json);
        setLoading(false); // set loading to false after data is fetched
      } catch (error) {
        setLoading(false); // set loading to false even if there's an error
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
          Forrige side
        </button>
      )}
      <p className="mx-4">
        Side {currentPage} af {totalPages}
      </p>
      {currentPage < totalPages && (
        <button
          className="bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Næste side
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
  const [hasSearched, setHasSearched] = React.useState(false);

  const hitCount = parseInt(searchResult.search?.hitcount) || 0;
  const totalPages = hitCount > 0 ? Math.ceil(hitCount / pageSize) : 1;
  const router = useRouter();
  const prevQuery = React.useRef(router.query);

  // This useEffect runs only once when the component is first mounted
  React.useEffect(() => {
    const { q, offset, limit } = router.query;

    if (q !== queryString) {
      setUserSearchRequest(q || "");
      setQueryString(q || "");
    }

    if (Number(offset) !== currentPage) {
      setCurrentPage(Number(offset) || 1);
    }

    if (Number(limit) !== pageSize) {
      setPageSize(Number(limit) || 10);
    }
  }, []); // Empty dependency array means this hook runs once on mount

  // This useEffect runs whenever router.query changes
  React.useEffect(() => {
    const { q, offset, limit } = router.query;

    if (
      prevQuery.current.q === q &&
      prevQuery.current.offset === offset &&
      prevQuery.current.limit === limit
    ) {
      return;
    }

    prevQuery.current = router.query;

    if (q !== queryString) {
      setUserSearchRequest(q || "");
      setQueryString(q || "");
    }

    if (Number(offset) !== currentPage) {
      setCurrentPage(Number(offset) || 1);
    }

    if (Number(limit) !== pageSize) {
      setPageSize(Number(limit) || 10);
    }
  }, [router.query]);
  
  return (
    <div>
      <div className="pb-20">
        <form
          className="flex w-full px-4"
          onSubmit={e => {
            e.preventDefault();
            setQueryString(userSearchRequest);
            setCurrentPage(1);
            setHasSearched(true);

            router.push({
              pathname: '/search',
              query: { q: userSearchRequest, offset: 0, limit: pageSize },
            });

          }}
        >
          <input 
            className="flex w-11/12 border-solid border-2 border-gray-600 rounded py-3 px-3 text-gray-700 mb-1 focus:outline-none focus:shadow-outline" 
            type="search" 
            placeholder="Søg efter titel, forfatter eller emne ..." 
            id="search" 
            name="search"
            autoComplete="on" 
            autoFocus 
            required
            value={userSearchRequest} // Set the input field's value to userSearchRequest
            onInvalid={(e) => {
              e.target.setCustomValidity("Skriv venligst noget i søgefeltet for at fortsætte med søgningen.");
            }}
            onInput={(e) => {
              e.target.setCustomValidity("");
            }} 
            onChange={e => setUserSearchRequest(e.target.value)} 
          />
          <button className="ml-4 bg-green-600 hover:bg-green-400 text-white rounded-full py-2 px-6 font-semibold" type="submit">Søg</button>
        </form>
        {loading ? (
          <div className="mx-4 my-2">
            {Array.from({ length: pageSize }).map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-300 p-6 rounded-md tracking-wide shadow-lg mb-4">
                <div className="h-4 bg-gray-400 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-400 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-blue-400 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : searchResult.search?.works?.length > 0 ? (
          <div>
            <div className="mx-4 my-2">
              <p className="text-md font-semibold mb-2">{searchResult.search?.hitcount} værker i søgeresultatet</p>
              {searchResult.search?.works?.map((result, index) => {
                const title = result.titles.full[0];
                const creator = result.creators[0]?.display;
                const creatorRole = result.creators[0]?.roles[0]?.function.singular;
                const date = result.workYear?.display || result.workYear?.year;
                const materialType = result.materialTypes[0]?.specific;
                const identifier = result.workId;

                function generateInfoString(creator, date) {
                  const strings = [];
                            
                  if (creator) {
                    const creatorRoleCapitalized = creatorRole ? creatorRole.charAt(0).toUpperCase() + creatorRole.slice(1) : '';
                    strings.push(`${creatorRoleCapitalized} ${creator}`);
                  }                
                            
                  if (date) {
                    const prefix = creator ? " i " : "Udgivet i ";
                    strings.push(`${prefix}${date}`);
                  }
                            
                  return strings.join(" ");
                }        
                
                const loanLink = `https://beta.bibliotek.dk/work/${encodeURIComponent(identifier)}`
                
                return (
                  <div key={index} className="bg-white border-2 border-gray-300 p-6 rounded-md tracking-wide shadow-lg mb-4">
                    <h2 className="text-xl font-bold mb-2">{title}</h2>
                    <p className="text-md font-semibold mb-2">{generateInfoString(creator, date)}</p>
                    <a href={loanLink} target="_blank" title="Bestil via Bibliotek.dk" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Bestil som {materialType ? materialType.toLowerCase() : ''} på dansk
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
        ) : hasSearched ? (
          <div className="block relative border-solid border-2 border-gray-600 clear-both py-2 px-2 mx-4 my-4">
            <p className="block font-bold m-4 text-xl text-center">Vi fandt desværre ikke nogen materialer der matchede din søgning ...</p>
          </div>
        ) : (
          <div className="block w-11/12 flex-auto py-3 px-3bg-white border-2 border-gray-300 p-6 rounded-md tracking-tight shadow-lg my-10 mx-10 space-y-4">
            <h2 className="text-2xl font-bold mb-2">Velkommen til min hjemmeside!</h2>
            <p className="text-md font-semibold mb-2">
              Mit navn er Rolf Madsen, og jeg arbejder på Københavns Universitet som IT arkitet.
            </p>
            <p className="text-md font-semibold mb-2">
              Formålet med siden for at dele de eksperimenter jeg laver særligt i NextJS, TypeScript, Rust og Python.
            </p>
            <p className="text-md font-semibold mb-2">
              Hvis du er interesseret i at vide mere om mig eller mit arbejde, er du velkommen til at tjekke mine profiler på <a href="https://www.linkedin.com/in/rolfmadsen/?originalSubdomain=dk" className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">LinkedIn</a> og <a href="https://github.com/rolfmadsen/rolfmadsen/" className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">GitHub</a>.
            </p>
            <p className="text-md font-semibold mb-2">
              Du er altid velkommen til at kontakte mig, hvis du er nysgerrig og har lyst til at vide mere.
            </p>
            <p className="text-md font-semibold mb-2">
              Tak fordi du besøger min side.
            </p>
         </div>
        )}
      </div>
    </div>
  );
}

export default Opensearch;