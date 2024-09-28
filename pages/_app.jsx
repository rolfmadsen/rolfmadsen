// pages/_app.jsx
import '../styles/globals.css'
import PiwikProProvider from '@piwikpro/next-piwik-pro'

export default function MyApp({ Component, pageProps }) {
  const isBrowser = typeof window !== 'undefined';

  return (
    <>
      {isBrowser && (
        <PiwikProProvider
          containerUrl={process.env.NEXT_PUBLIC_CONTAINER_URL} 
          containerId={process.env.NEXT_PUBLIC_CONTAINER_ID}
        >
          <Component {...pageProps} />
        </PiwikProProvider>
      )}
      {!isBrowser && <Component {...pageProps} />}
    </>
  )
}