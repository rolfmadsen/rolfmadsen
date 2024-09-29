import React from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  return (
    <header className="clear-both w-full bg-gray-800 text-white py-4 px-6">
      <h1 className="text-4xl">
        <Link href="/">
          <button
            className="text-teal-500 font-normal"
            title="Til forsiden"
            onClick={(e) => {
              if (router.pathname !== "/") {
                e.preventDefault();
                router.push("/");
              }
            }}
          >
            Metadata & Discovery
          </button>
        </Link>
      </h1>
    </header>
  );
}