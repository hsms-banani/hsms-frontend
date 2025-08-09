// src/components/HomePage/UsefulInformationSection.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsItem } from '@/types/news';
import { newsApi } from '@/lib/newsApi';
import { formatDateShort, getRelativeTime } from '@/utils/dateUtils';
import { truncateText } from '@/utils/textUtils';

// Interface for Useful Information items
interface InfoItem {
  id: number;
  title: string;
  icon: string;
  link: string;
}

export default function UsefulInformationSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        const latestNews = await newsApi.getLatestNews(3);
        setNewsItems(latestNews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  // Useful information items with their corresponding icons
  const infoItems: InfoItem[] = [
    {
      id: 1,
      title: "Class Schedule",
      icon: "calendar-clock",
      link: "/schedule"
    },
    {
      id: 2,
      title: "Deans' Office Hours",
      icon: "user-clock",
      link: "/deans-hours"
    },
    {
      id: 3,
      title: "IT Services Servicedesk",
      icon: "computer",
      link: "/it-services"
    },
    {
      id: 4,
      title: "Academic Contributions (Fees)",
      icon: "credit-card",
      link: "/fees"
    },
    {
      id: 5,
      title: "Academic Calendar",
      icon: "calendar",
      link: "/calendar"
    },
    {
      id: 6,
      title: "Office Hours",
      icon: "clock",
      link: "/office-hours"
    },
    {
      id: 7,
      title: "Guide to Services and Forms",
      icon: "file-text",
      link: "/services-guide"
    },
    {
      id: 8,
      title: "Ordo 2024-2025",
      icon: "book-open",
      link: "/ordo"
    },
    {
      id: 9,
      title: "Course Contents",
      icon: "list",
      link: "/courses"
    },
    {
      id: 10,
      title: "COMPILATIO",
      icon: "check-square",
      link: "/compilatio"
    }
  ];

  const renderNewsItem = (news: NewsItem, index: number) => (
    <div key={news.id} className="mb-8 last:mb-0">
      <div className="flex items-start space-x-4">
        {/* News Image or Date Icon */}
        <div className="flex-shrink-0">
          {news.image_url ? (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={news.image_url}
                alt={news.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-amber-100 text-amber-700 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold">
                {new Date(news.published_at || news.created_at).toLocaleDateString('en-US', { month: 'short' })}
              </span>
              <span className="text-sm font-bold">
                {new Date(news.published_at || news.created_at).getDate()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm text-gray-500">
              {formatDateShort(news.published_at || news.created_at)}
            </span>
            {news.category && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-amber-600 font-medium">
                  {news.category.name}
                </span>
              </>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-indigo-900 mb-2 hover:text-amber-600 transition-colors line-clamp-2">
            <Link href={`/news/${news.slug}`}>
              {news.title}
            </Link>
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
            {truncateText(news.excerpt, 120)}
          </p>
          
          <div className="flex items-center text-xs text-gray-500 space-x-3">
            <span>{news.read_time} min read</span>
            <span>•</span>
            <span>{news.views_count} views</span>
            {news.featured && (
              <>
                <span>•</span>
                <span className="text-amber-600 font-medium">Featured</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {index !== newsItems.length - 1 && (
        <div className="mt-6 mb-6 border-b border-gray-100"></div>
      )}
    </div>
  );

  const renderLoadingState = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start space-x-4 animate-pulse">
          <div className="h-16 w-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-8">
      <div className="text-gray-500 mb-4">
        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-gray-600 mb-4">Unable to load latest news</p>
      <button 
        onClick={() => window.location.reload()} 
        className="text-amber-600 hover:text-amber-700 font-medium"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* News & Updates Column */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-amber-500 p-4">
              <h2 className="text-2xl font-bold text-white">News & Updates</h2>
            </div>
            
            <div className="p-6">
              {loading ? (
                renderLoadingState()
              ) : error ? (
                renderErrorState()
              ) : newsItems.length > 0 ? (
                <>
                  {newsItems.map((news, index) => renderNewsItem(news, index))}
                  
                  <div className="mt-6 flex justify-end">
                    <Link 
                      href="/news" 
                      className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                      View All News
                      <svg 
                        className="ml-1 w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13 7l5 5m0 0l-5 5m5-5H6" 
                        />
                      </svg>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No news available at the moment.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Useful Information Column */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-indigo-800 p-4">
              <h2 className="text-2xl font-bold text-white">Useful Information</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infoItems.map((item) => (
                  <Link 
                    key={item.id} 
                    href={item.link}
                    className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3 group-hover:bg-amber-200 transition-colors">
                      <IconComponent name={item.icon} />
                    </div>
                    <span className="text-gray-800 font-medium group-hover:text-indigo-700 transition-colors">
                      {item.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Simple icon component that renders different SVG icons based on name
function IconComponent({ name }: { name: string }) {
  // Map of icon names to JSX elements
  const icons: { [key: string]: JSX.Element } = {
    "calendar-clock": (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <circle cx="12" cy="16" r="4"></circle>
        <polyline points="12 14 12 16 14 16"></polyline>
      </svg>
    ),
    "user-clock": (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <circle cx="18" cy="16" r="3"></circle>
        <polyline points="17 14 18 16 19 14"></polyline>
      </svg>
    ),
    "computer": (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
    "credit-card": (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    ),
    "calendar": (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    "clock": (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    "file-text": (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    "book-open": (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    ),
    "list": (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
    ),
    "check-square": (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"></polyline>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
      </svg>
    )
  };

  // Return the icon or a fallback
  return icons[name] || (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );
}