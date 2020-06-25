import React from "react";
import Head from 'next/head'
import Header from '../components/Header';
import Footer from '../components/Footer';

function Layout({ children }) {
  return <html lang="en" className="text-gray-900 leading-tight bg-blue-100">
    <Head className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <title> Alpha Folkebiblioteket</title>
      <link rel="icon" href="../public/images/favicon/favicon.ico" />
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      <meta charSet='UTF-8' />
    </Head>
    <body className="container mx-auto p-4 clear-both">
      <Header />
      <div>{children}</div>
      <Footer />
    </body>
  </html>
}
  
export default Layout