// src/app/news/[slug]/page.tsx
import { Metadata } from 'next';
import NewsDetailClient from '@/components/News/NewsDetailClient';

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  // Await the params before using them
  const { slug } = await params;
  
  // Simple metadata without pre-fetching
  return {
    title: `News Article | Holy Spirit Major Seminary`,
    description: 'Read the latest news and updates from Holy Spirit Major Seminary.',
    openGraph: {
      title: `News Article | Holy Spirit Major Seminary`,
      description: 'Read the latest news and updates from Holy Spirit Major Seminary.',
      type: 'article',
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  // Await the params before using them
  const { slug } = await params;
  
  return <NewsDetailClient slug={slug} />;
}