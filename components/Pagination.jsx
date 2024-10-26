// components/Pagination.jsx

import React from 'react';

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

export default Pagination;