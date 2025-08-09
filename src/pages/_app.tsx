// pages/_app.tsx
import { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Meta } from '../components/SEO/Meta';
import { SchoolSchema } from '../components/SEO/SeminarySchema';
import { Loader } from '../components/UI/Loader';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds loading screen
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Meta />
      <SchoolSchema />
      
      {loading ? (
        <Loader showPercentage={true} />
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}