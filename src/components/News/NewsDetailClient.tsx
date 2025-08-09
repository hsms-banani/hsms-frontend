// src/components/News/NewsDetailClient.tsx - Fixed with Deep Black Text
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useNewsDetail } from '@/hooks/useNews';
import { formatDate, getRelativeTime } from '@/utils/dateUtils';

interface NewsDetailClientProps {
  slug: string;
}

export default function NewsDetailClient({ slug }: NewsDetailClientProps) {
  const { news, loading, error } = useNewsDetail(slug);

  if (loading) {
    return <NewsDetailSkeleton />;
  }

  if (error || !news) {
    if (error?.includes('404')) {
      notFound();
    }
    return <NewsDetailError error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                {/* FIXED: Changed from text-gray-500 to text-black */}
                <Link href="/" className="text-black hover:text-indigo-600">
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                {/* FIXED: Changed from text-gray-500 to text-black */}
                <Link href="/news" className="text-black hover:text-indigo-600">
                  News
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              {/* FIXED: Changed from text-gray-900 to text-black */}
              <li className="text-black font-medium truncate max-w-xs">
                {news.title}
              </li>
            </ol>
          </nav>

          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <div className="mb-8">
              {news.featured && (
                <div className="mb-4">
                  <span className="bg-amber-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Featured Article
                  </span>
                </div>
              )}

              {/* FIXED: Changed from text-gray-900 to text-black */}
              <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6">
                {news.title}
              </h1>

              {/* FIXED: Changed from text-gray-600 to text-black */}
              <div className="flex flex-wrap items-center text-black mb-6 space-x-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={news.published_at || news.created_at}>
                    {formatDate(news.published_at || news.created_at)}
                  </time>
                </div>

                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>By {news.author_name}</span>
                </div>

                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{news.read_time} min read</span>
                </div>

                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{news.views_count} views</span>
                </div>

                {news.category && (
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {news.category.name}
                  </span>
                )}
              </div>

              {/* Excerpt - FIXED: Changed from text-gray-700 to text-black */}
              <p className="text-xl text-black leading-relaxed font-light mb-8">
                {news.excerpt}
              </p>
            </div>

            {/* Featured Image */}
            {news.image_url && (
              <div className="mb-12">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={news.image_url}
                    alt={news.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-indigo max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: news.content }}
                className="leading-relaxed"
                style={{
                  color: '#000000' // FIXED: Explicitly set content text to pure black
                }}
              />
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                {/* FIXED: Changed from text-gray-500 to text-black */}
                <div className="text-sm text-black">
                  Last updated: {getRelativeTime(news.updated_at)}
                </div>
                
                {/* Simple Share Button */}
                <div className="flex items-center space-x-4">
                  {/* FIXED: Changed from text-gray-500 to text-black */}
                  <span className="text-sm text-black">Share:</span>
                  <button
                    onClick={() => {
                      const url = window.location.href;
                      const text = `${news.title} - ${news.excerpt}`;
                      if (navigator.share) {
                        navigator.share({ title: news.title, text, url });
                      } else {
                        navigator.clipboard.writeText(url);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Share this article"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to News Button */}
      <div className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/news"
              className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to All News
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component
function NewsDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb skeleton */}
          <div className="mb-8 flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-1"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-1"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Header skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="flex items-center space-x-6 mb-6">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-full"></div>
            </div>

            {/* Image skeleton */}
            <div className="mb-12">
              <div className="aspect-video bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error component
function NewsDetailError({ error }: { error: string | null }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        {/* FIXED: Changed from text-gray-900 to text-black */}
        <h3 className="text-lg font-medium text-black mb-2">
          Error Loading Article
        </h3>
        {/* FIXED: Changed from text-gray-600 to text-black */}
        <p className="text-black mb-6">
          {error || 'Something went wrong while loading the news article. Please try again later.'}
        </p>
        <div className="space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/news"
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors inline-block"
          >
            Back to News
          </Link>
        </div>
      </div>
    </div>
  );
}