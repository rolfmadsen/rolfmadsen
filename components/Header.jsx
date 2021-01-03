import React from "react";
import Link from 'next/link'

const Header = () => (
  <>
    <header className="clear-both w-full">
      <div>
        <Link href="/">
          <a>
            <h1 className="text-4xl font-bold text-black float-left px-4">Alpha FolkeBiblioteket</h1>
          </a>
        </Link>
      </div>
    </header>
  </>
);

export default Header;