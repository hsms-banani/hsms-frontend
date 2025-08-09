// components/SEO/Meta.tsx
import Head from 'next/head';

interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  seminaryName?: string;
}

export function Meta({
  title = 'Holy Spirit Major Seminary',
  description = 'Holy Spirit Major Seminary offers comprehensive Theological and Philosophical Education, forming priests and religious through rigorous academic programs and spiritual formation.',
  keywords = 'Holy Spirit Major Seminary, theological education, philosophical education, priest formation, seminary, Catholic education, religious formation, theology, philosophy',
  ogImage = '/images/holy-spirit-seminary-logo.jpg',
  ogType = 'website',
  canonicalUrl = 'https://holyspiritseminary.org',
  seminaryName = 'Holy Spirit Major Seminary'
}: MetaProps) {
  
  const fullTitle = title === 'Holy Spirit Major Seminary' 
    ? title 
    : `${title} | ${seminaryName}`;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.manifest" />
      
      {/* Robots */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
}