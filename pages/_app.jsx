// pages/_app.jsx
import '../styles/globals.css';
import dynamic from 'next/dynamic';

const PiwikProProvider = dynamic(
  () => import('@piwikpro/next-piwik-pro').then((mod) => mod.default),
  { ssr: false }
);

export default function MyApp({ Component, pageProps }) {
  return (
    <PiwikProProvider
      containerUrl={process.env.NEXT_PUBLIC_CONTAINER_URL}
      containerId={process.env.NEXT_PUBLIC_CONTAINER_ID}
    >
      <Component {...pageProps} />
    </PiwikProProvider>
  );
}