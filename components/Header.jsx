import React from "react";
import Link from 'next/link'

const Header = () => (
  <>
    <header>
        <nav className="clear-both">
          <div className="bg-green-600">
            <Link href="/">
              <a>
                <h1 className="text-4xl font-bold text-black float-left px-4">Alpha Folkebiblioteket</h1>
              </a>
            </Link>
          </div>
          <ul className="flex float-right mx-4 list-none">
            <li className="flex mx-2 my-4">
              <Link href="/opensearch/marcxchange">
                <a className="border border-blue-500 rounded py-1 px-3 text-black">Opensearch API (marcXchange)</a>
              </Link>
            </li>
          </ul>
        </nav>
    </header>
  </>
);

export default Header;