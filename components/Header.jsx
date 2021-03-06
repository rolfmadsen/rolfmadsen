import React from "react";
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()
  return <>
    <header className="clear-both w-full">
      <div>
          <a href ="/" onClick={() => router.reload()}>
            <h1 className="text-4xl font-bold text-black float-left px-4" title="Go to frontpage">Alpha FolkeBiblioteket</h1>
          </a>
      </div>
    </header>
  </>
}