import React from "react";
import Head from 'next/head'
import Header from '../components/Header';
import Footer from '../components/Footer';

function Layout({ children }) {
  return <html lang="da">
    <Head>
      <title>Alpha Folkebiblioteket</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      <meta charSet='UTF-8' />
    </Head>
    <body>
      <Header />
      <div>{children}</div>
      <Footer />
    </body>
  </html>
}
  
export default Layout