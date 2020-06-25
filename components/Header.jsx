import React from "react";
import Link from 'next/link'

const Header = () => (
  <>
    <header>
      <div className="container clear-both bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <nav>
          <Link href="/">
            <a>
              <h1 className="text-4xl font-bold text-black pt-4 pl-4 float-left">Alpha Folkebiblioteket</h1>
            </a>
          </Link>
          <ul className="flex p-5 float-right">       
            <li className="mr-3">
              <Link href="/openplatform">
                <a className="border border-blue-500 rounded py-1 px-3 bg-blue-500 text-white">Openplatform API</a>
              </Link>
            </li>  
            <li className="mr-3">
              <Link href="/opensearch/marcxchange">
                <a className="border border-blue-500 rounded py-1 px-3 bg-blue-500 text-white">Opensearch API (marcXchange)</a>
              </Link>
            </li> 
          </ul>
        </nav>
      </div>
    </header>
  </>
);

export default Header;