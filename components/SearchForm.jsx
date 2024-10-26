// components/SearchForm.jsx

import React from 'react';

function SearchForm({ userSearchRequest, setUserSearchRequest, onSearch }) {
  return (
    <form
      className="flex flex-col sm:flex-row w-full mt-6 mb-6"
      onSubmit={e => {
        e.preventDefault();
        onSearch();
      }}
    >
      <input
        className="w-full sm:w-11/12 border-solid border-2 border-gray-400 rounded-lg py-3 px-4 text-gray-800 mb-2 sm:mb-0 sm:mr-4 focus:outline-none focus:shadow-outline"
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
      <button className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg py-2 px-6 transition-colors duration-300 ease-in-out">
        Søg
      </button>
    </form>
  );
}

export default SearchForm;