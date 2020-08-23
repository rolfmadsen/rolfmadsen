import React, { useState } from "react";

function Pagination() {
  const hitCount = 1;
  return (
      <>
      <pagination className="flex justify-center w-full px-4">
        <span>Hitcount: {hitCount}</span>
        <button className="bg-green-600 hover:bg-green-400 text-white px-2 mx-2 rounded-lg">Previous</button> 
        <button className="bg-green-600 hover:bg-green-400 text-white px-2 mx-2 rounded-lg">Next</button>
      </pagination>
      </>
  );
}
export default Pagination;