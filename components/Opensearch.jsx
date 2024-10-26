// components/Opensearch.jsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import LoadingIndicator from './LoadingIndicator';
import Pagination from './Pagination';
import WelcomeMessage from './WelcomeMessage';

function useOpenPlatformSearch(queryString, currentPage, pageSize) {
  const [searchResult, setSearchResult] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!queryString) {
      setSearchResult({});
      return;
    }

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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setSearchResult(json);
      } catch (error) {
        console.error('Error fetching book list:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookList();
  }, [queryString, currentPage, pageSize]);

  return [searchResult, loading];
}

function Opensearch() {
  const [userSearchRequest, setUserSearchRequest] = useState('');
  const [queryString, setQueryString] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchResult, loading] = useOpenPlatformSearch(queryString, currentPage, pageSize);
  const [hasSearched, setHasSearched] = useState(false);

  const router = useRouter();

  // Immediately sync state with router query when component mounts or router query changes
  useEffect(() => {
    const { q, offset, limit } = router.query;

    if (q) {
      setUserSearchRequest(q);
      setQueryString(q);
      setHasSearched(true);
    } else {
      // When `q` is not present, reset search state
      setUserSearchRequest('');
      setQueryString('');
      setHasSearched(false);
    }

    if (offset) {
      setCurrentPage(Number(offset) || 1);
    } else {
      setCurrentPage(1);
    }

    if (limit) {
      setPageSize(Number(limit) || 12);
    } else {
      setPageSize(12);
    }
  }, [router.query]);

  const handleSearch = () => {
    setQueryString(userSearchRequest);
    setCurrentPage(1);
    setHasSearched(true);

    router.push({
      pathname: '/',
      query: { q: userSearchRequest, offset: 1, limit: pageSize },
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    router.push({
      pathname: '/',
      query: { q: queryString, offset: page, limit: pageSize },
    });
  };

  const records = searchResult.search?.works || [];
  const hitCount = parseInt(searchResult.search?.hitcount) || 0;
  const totalPages = hitCount > 0 ? Math.ceil(hitCount / pageSize) : 1;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6">
        <SearchForm
          userSearchRequest={userSearchRequest}
          setUserSearchRequest={setUserSearchRequest}
          onSearch={handleSearch}
        />

        {loading ? (
          <LoadingIndicator />
        ) : records.length > 0 ? (
          <>
            <SearchResults results={records} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        ) : hasSearched ? (
          <div className="text-center mt-6">
            <p>Vi fandt desværre ikke nogen materialer der matchede din søgning ...</p>
          </div>
        ) : (
          <WelcomeMessage />
        )}
      </div>
    </div>
  );
}

export default Opensearch;