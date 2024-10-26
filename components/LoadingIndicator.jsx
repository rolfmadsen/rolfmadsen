// components/LoadingIndicator.jsx

import React from 'react';

function LoadingIndicator() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-300 p-6 rounded-lg shadow-lg"
        >
          <div className="h-4 bg-gray-400 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-400 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-400 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}

export default LoadingIndicator;