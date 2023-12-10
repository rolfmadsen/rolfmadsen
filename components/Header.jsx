import React, { useState, useEffect } from "react";
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()
  return (
    <>
      <header className="clear-both w-full">
        <div>
          <h1>
            <Link href="/">
              <button
                className="text-4xl text-black float-left px-4 py-4" 
                title="Til forsiden"
                onClick={(e) => {
                  if (router.pathname !== "/") {
                    e.preventDefault();
                    router.push("/");
                  }
                }}
              >
                Metadata & Discovery ...
              </button>
            </Link>
          </h1>
        </div>
      </header>
    </>
  );
}