import React from "react";
import Head from 'next/head'
import Header from '../components/Header';
import Footer from '../components/Footer';

function Layout({ children }) {
  return <html lang="da">
    <Head>
      <title>Alpha FolkeBiblioteket</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
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