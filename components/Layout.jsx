import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Metadata & Discovery</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta charSet="UTF-8" />
      </Head>

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-grow pt-16 sm:pt-0">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;