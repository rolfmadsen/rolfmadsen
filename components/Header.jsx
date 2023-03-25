import React from "react";
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()
  return <>
    <header className="clear-both w-full">
      <div>
        <h1>
          <Link href ="/" onClick={() => router.reload()}>
            <button
              className="text-4xl font-bold text-black float-left px-4" title="Go to frontpage"
            >
              Alpa FolkeBiblioteket
            </button>
          </Link>
        </h1>
      </div>
    </header>
  </>
}