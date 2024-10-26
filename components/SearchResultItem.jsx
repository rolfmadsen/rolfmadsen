// components/SearchResultItem.jsx

import React from 'react';
import Link from 'next/link';
import OrderButton from './OrderButton';

function SearchResultItem({ result }) {
  const title = result.titles.full[0];
  const creator = result.creators[0]?.display;
  const creatorRole = result.creators[0]?.roles[0]?.function.singular;
  const date = result.workYear?.display || result.workYear?.year;
  const materialType = result.materialTypes[0]?.specific;
  const identifier = result.workId;

  function generateInfoString(creator, date) {
    const strings = [];
    if (creator) {
      const creatorRoleCapitalized = creatorRole
        ? creatorRole.charAt(0).toUpperCase() + creatorRole.slice(1)
        : '';
      strings.push(`${creatorRoleCapitalized} ${creator}`);
    }
    if (date) {
      const prefix = creator ? ' i ' : 'Udgivet i ';
      strings.push(`${prefix}${date}`);
    }
    return strings.join(' ');
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link href={`/work/${encodeURIComponent(identifier)}`}>
        <div className="p-6 cursor-pointer">
          <h2 className="text-xl font-normal mb-2 text-gray-800">{title}</h2>
          <p className="text-md text-gray-600 mb-4">{generateInfoString(creator, date)}</p>
        </div>
      </Link>
      <div className="p-6 pt-0">
        <OrderButton identifier={identifier} materialType={materialType} />
      </div>
    </div>
  );
}

export default SearchResultItem;