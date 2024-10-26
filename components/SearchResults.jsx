// components/SearchResults.jsx

import React from 'react';
import SearchResultItem from './SearchResultItem';

function SearchResults({ results }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result, index) => (
        <SearchResultItem key={index} result={result} />
      ))}
    </div>
  );
}

export default SearchResults;