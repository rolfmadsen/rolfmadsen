// components/Layout.jsx

import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Metadata & Discovery</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta charSet="UTF-8" />
      </Head>
      {/* Flex container with min height and column layout */}
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {/* Center the content with max width and horizontal margins */}
          <div className="max-w-7xl mx-auto px-6">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Layout;