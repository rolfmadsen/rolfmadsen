import React from "react";
import Link from 'next/link'

const Footer = () => (
  <footer className="fixed bottom-0 bg-white bg-opacity-75 py-5 w-full">
      <span className="inline float-left mx-10 sm:block">
        <Link href="/service/opensearchdkabm" passHref>
          <button
            type="button"
            className="py-2 px-2 bg-white border border-black rounded text-black cursor-pointer"
          >
            Opensearch API (DKABM)
          </button>
        </Link>
      </span>
      <span className="inline float-left mx-10 sm:block">
        <Link href="/service/openplatformdkabm" passHref>
          <button
            type="button"
            className="py-2 px-2 bg-white border border-black rounded text-black cursor-pointer"
            >
            Openplatform API (DKABM)
          </button>
        </Link>  
      </span>
      <span className="inline float-left mx-10 sm:block">
        <Link href="/service/opensearchmarcxchange" passHref>
          <button
            type="button"
            className="py-2 px-2 bg-white border border-black rounded text-black cursor-pointer"
            >
            Opensearch API (marcXchange)
          </button>
        </Link>
      </span>
      <span className="inline float-right mx-10 sm:block">
        <span className="ml-2 py-2 px-2 bg-black text-white rounded-full"><a href="https://dk.linkedin.com/in/rolfmadsen/">LinkedIn - Rolf Madsen 2020</a></span>
        <span className="ml-2 py-2 px-2 bg-black text-white rounded-full"><a href="https://github.com/rolfmadsen//rolfmadsen/">Github © Rolf Madsen 2020</a></span>
      </span>
  </footer>
);

export default Footer;