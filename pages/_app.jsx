// pages/_app.jsx
import '../styles/globals.css'
import PiwikProProvider from '@piwikpro/next-piwik-pro'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <PiwikProProvider
        containerId={process.env.NEXT_PUBLIC_CONTAINER_ID}
        containerUrl={process.env.NEXT_PUBLIC_CONTAINER_URL} 
      >
        <Component {...pageProps} />
      </PiwikProProvider>
    </>
  )
}