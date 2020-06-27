import React from "react";
import Link from 'next/link'

const Header = () => (
  <>
    <header>
      <div>
        <nav className="clear-both">
          <Link href="/">
            <a>
              <h1 className="text-4xl font-bold text-black float-left px-4">Alpha Folkebiblioteket</h1>
            </a>
          </Link>
          <ul className="flex float-right mx-4 list-none">
            <li className="flex mx-2 my-4">
              <Link href="/opensearch/marcxchange">
                <a className="border border-blue-500 rounded py-1 px-3 text-black">Opensearch API (marcXchange)</a>
              </Link>
            </li>
            <li className="flex mx-2 my-4">
              <Link href="/openplatform">
                <a className="border border-blue-500 rounded py-1 px-3 text-black">Openplatform API</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  </>
);

export default Header;