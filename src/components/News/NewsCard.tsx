// src/components/News/NewsCard.tsx - Fixed with Deep Black Text
import Image from 'next/image';
import Link from 'next/link';
import { NewsItem } from '@/types/news';
import { formatDateShort } from '@/utils/dateUtils';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Featured Badge */}
      {news.featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Featured
          </span>
        </div>
      )}

      {/* News Image */}
      <div className="relative h-48 overflow-hidden">
        {news.image_url ? (
          <Image
            src={news.image_url}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-sm font-medium">News Article</p>
            </div>
          </div>
        )}
      </div>

      {/* News Content */}
      <div className="p-6">
        {/* Meta Information - FIXED: Changed from text-gray-500 to text-black */}
        <div className="flex items-center text-sm text-black mb-3 space-x-2">
          <time dateTime={news.published_at || news.created_at}>
            {formatDateShort(news.published_at || news.created_at)}
          </time>
          
          {news.category && (
            <>
              <span>•</span>
              <span className="text-amber-600 font-medium">
                {news.category.name}
              </span>
            </>
          )}
          
          <span>•</span>
          <span>By {news.author_name}</span>
        </div>

        {/* Title - FIXED: Changed hover from text-indigo-600 to black, and base from text-gray-900 to text-black */}
        <h2 className="text-xl font-semibold text-black mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          <Link href={`/news/${news.slug}`}>
            {news.title}
          </Link>
        </h2>

        {/* Excerpt - FIXED: Changed from text-gray-600 to text-black */}
        <p className="text-black mb-4 line-clamp-3">
          {news.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* FIXED: Changed from text-gray-500 to text-black */}
          <div className="flex items-center space-x-4 text-sm text-black">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {news.read_time} min read
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {news.views_count} views
            </span>
          </div>

          <Link 
            href={`/news/${news.slug}`}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center group"
          >
            Read More
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}