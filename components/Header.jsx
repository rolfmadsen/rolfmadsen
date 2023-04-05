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
              className="text-4xl text-black float-left px-4 py-4 " title="Til forsiden"
            >
              Eksperimenter - Den Fælles Biblioteksinfrastruktur
            </button>
          </Link>
        </h1>
      </div>
    </header>
  </>
}