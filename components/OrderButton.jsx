// components/OrderButton.jsx

import React from 'react';

function OrderButton({ identifier, materialType }) {
  const loanLink = `https://bibliotek.dk/work/${encodeURIComponent(identifier)}`;
  
  return (
    <a
      href={loanLink}
      target="_blank"
      rel="noopener noreferrer"
      title="Bestil via Bibliotek.dk"
      className="inline-block bg-teal-500 text-white font-bold py-2 px-4 rounded hover:bg-teal-600 transition-colors duration-300 ease-in-out"
    >
      Bestil som {materialType ? materialType.toLowerCase() : 'materiale'} på dansk
    </a>
  );
}

export default OrderButton;
