// src/components/News/NewsListClient.tsx - Fixed with Deep Black Text
'use client';

import { useState } from 'react';
import { useNews } from '@/hooks/useNews';
import NewsCard from '@/components/News/NewsCard';

export default function NewsListClient() {
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    page_size: 12,
  });

  const { news, loading, error, pagination, refetch } = useNews(filters);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    
    const newFilters = { ...filters, search, page: 1 };
    setFilters(newFilters);
    refetch(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    refetch(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    const newFilters = { ...filters, search: '', page: 1 };
    setFilters(newFilters);
    refetch(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-indigo-900 mb-4">
              News & Updates
            </h1>
            {/* FIXED: Changed from text-gray-600 to text-black */}
            <p className="text-xl text-black max-w-3xl mx-auto">
              Stay informed with the latest news, announcements, and events from Holy Spirit Major Seminary
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="max-w-md mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              defaultValue={filters.search}
              placeholder="Search news..."
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white text-black placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              style={{ color: '#000000' }} // FIXED: Explicitly set input text to black
            />
            {filters.search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>
        </div>

        {/* Active Search Display */}
        {filters.search && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-blue-800 font-medium">
                  Search results for: "{filters.search}"
                </span>
                <span className="text-sm text-blue-600">
                  ({pagination.count} results)
                </span>
              </div>
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {/* FIXED: Changed from text-gray-900 to text-black */}
            <h3 className="text-xl font-semibold text-black mb-2">Error Loading News</h3>
            {/* FIXED: Changed from text-gray-600 to text-black */}
            <p className="text-black mb-6">{error}</p>
            <button
              onClick={() => refetch(filters)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && (
          <div className="max-w-6xl mx-auto">
            {news.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {news.map((newsItem) => (
                    <NewsCard key={newsItem.id} news={newsItem} />
                  ))}
                </div>

                {/* Simple Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.previous}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {/* FIXED: Changed from text-gray-600 to text-black */}
                    <span className="text-black">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.next}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                {/* FIXED: Changed from text-gray-900 to text-black */}
                <h3 className="text-xl font-semibold text-black mb-2">No News Found</h3>
                {/* FIXED: Changed from text-gray-600 to text-black */}
                <p className="text-black mb-6">
                  {filters.search
                    ? 'Try adjusting your search to see more results.'
                    : 'No news articles are available at the moment.'}
                </p>
                {filters.search && (
                  <button
                    onClick={clearSearch}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}