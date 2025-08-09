// src/app/news/page.tsx
import { Metadata } from 'next';
import NewsListClient from '@/components/News/NewsListClient';

export const metadata: Metadata = {
  title: 'News & Updates | Holy Spirit Major Seminary',
  description: 'Stay updated with the latest news, announcements, and events from Holy Spirit Major Seminary.',
  openGraph: {
    title: 'News & Updates | Holy Spirit Major Seminary',
    description: 'Stay updated with the latest news, announcements, and events from Holy Spirit Major Seminary.',
    type: 'website',
  },
};

export default function NewsPage() {
  return <NewsListClient />;
}