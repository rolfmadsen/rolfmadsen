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
      <Header />
      <main className="pt-16 sm:pt-0">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default Layout;