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
    <div className="flex justify-center py-10 items-center">
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
  const [pageSize, setPageSize] = React.useState(12);
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
      setPageSize(Number(limit) || 12);
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
      setPageSize(Number(limit) || 12);
    }
  }, [router.query]);

  return (
    <div>
      <div className>
        <form
          className="flex w-full px-6 mt-12 mb-12"
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
            className="flex-grow border-solid border-2 border-gray-400 rounded-lg px-4 text-gray-800 focus:outline-none focus:shadow-outline"
            type="search"
            placeholder="Søg efter titel, forfatter eller emne ..."
            id="search"
            name="search"
            autoComplete="on"
            autoFocus
            required
            value={userSearchRequest}
            onChange={e => setUserSearchRequest(e.target.value)}
          />
          <button className="ml-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg py-2 px-6 transition-colors duration-300 ease-in-out">
            Søg
          </button>
        </form>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-300 p-6 rounded-lg shadow-lg">
                <div className="h-4 bg-gray-400 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-400 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-400 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : searchResult.search?.works?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
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

              const loanLink = `https://beta.bibliotek.dk/work/${encodeURIComponent(identifier)}`;

              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
                  <h2 className="text-xl font-normal mb-2 text-gray-800">{title}</h2>
                  <p className="text-md text-gray-600 mb-4">{generateInfoString(creator, date)}</p>
                  <a
                    href={loanLink}
                    target="_blank"
                    title="Bestil via Bibliotek.dk"
                    rel="noopener noreferrer"
                    className="inline-block bg-teal-500 text-white font-bold py-2 px-4 rounded hover:bg-teal-600 transition-colors duration-300 ease-in-out"
                  >
                    Bestil som {materialType ? materialType.toLowerCase() : ''} på dansk
                  </a>
                </div>
              );
            })}
          </div>
        ) : hasSearched ? (
          <div className="block relative border-solid border-2 border-gray-600 clear-both py-2 px-2 mx-4 my-4">
            <p className="block font-bold m-4 text-xl text-center">
              Vi fandt desværre ikke nogen materialer der matchede din søgning ...
            </p>
          </div>
        ) : (
          <div className="block w-11/12 flex-auto py-3 px-3 bg-white border-2 border-gray-300 p-6 rounded-md tracking-tight shadow-lg my-10 mx-10 space-y-4">
            <h2 className="text-3xl font-semi-bold mb-4 text-gray-800">Velkommen til Metadata & Discovery</h2>
            <p className="text-lg font-normal text-gray-700">
              Jeg hedder Rolf Madsen og arbejder som IT-arkitekt ved Københavns Universitet. Denne platform er udviklet som en demonstration af mine kompetencer inden for systemintegration og webudvikling.
            </p>
            <p className="text-lg font-normal text-gray-700">
              Platformen er baseret på en Rust-baseret integration til den danske Fælles Biblioteksinfrastruktur (FBI) via et GraphQL API, hvilket gør det muligt at fremsøge materialer og bestille dem fra danske biblioteker via <a href="https://bibliotek.dk" className="font-medium text-teal-600 underline dark:text-teal-500 hover:no-underline">Bibliotek.dk</a>.
            </p>
            <p className="text-lg font-normal text-gray-700">
              Hvis du er interesseret i mit arbejde, er du velkommen til at følge mig på <a href="https://www.linkedin.com/in/rolfmadsen/" className="font-medium text-teal-600 underline dark:text-teal-500 hover:no-underline">LinkedIn</a> eller <a href="https://github.com/rolfmadsen/" className="font-medium text-teal-600 underline dark:text-teal-500 hover:no-underline">GitHub</a>.
            </p>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={page => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export default Opensearch;