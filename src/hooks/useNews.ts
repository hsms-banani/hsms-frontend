// src/hooks/useNews.ts
import { useState, useEffect, useCallback } from 'react';
import { NewsItem, NewsListResponse } from '@/types/news';
import { newsApi } from '@/lib/newsService'; // Changed import

// Hook for fetching news list with basic filters
export function useNews(filters: {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  featured?: boolean;
} = {}) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    next: undefined as string | undefined,
    previous: undefined as string | undefined,
  });

  const fetchNews = useCallback(async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentFilters.page || 1,
        page_size: currentFilters.page_size || 12,
        search: currentFilters.search || '',
        category: currentFilters.category || '',
        featured: currentFilters.featured,
      };

      console.log('🔄 Fetching news with params:', params);

      const response = await newsApi.getNewsList(params);
      
      setNews(response.results || []);
      setPagination({
        count: response.count || 0,
        currentPage: params.page,
        totalPages: Math.ceil((response.count || 0) / params.page_size),
        next: response.next,
        previous: response.previous,
      });
    } catch (err) {
      console.error('❌ Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      setNews([]);
      setPagination({
        count: 0,
        currentPage: 1,
        totalPages: 1,
        next: undefined,
        previous: undefined,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback((newFilters?: typeof filters) => {
    fetchNews(newFilters || filters);
  }, [fetchNews, filters]);

  useEffect(() => {
    fetchNews(filters);
  }, [fetchNews]);

  return { news, loading, error, pagination, refetch };
}

// Hook for fetching single news detail
export function useNewsDetail(slug: string) {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Fetching news detail for slug:', slug);

        const data = await newsApi.getNewsDetail(slug);
        setNews(data);
      } catch (err) {
        console.error('❌ Error fetching news detail:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch news detail');
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [slug]);

  return { news, loading, error };
}

// Hook for fetching latest news (for homepage)
export function useLatestNews(limit: number = 5) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Fetching latest news with limit:', limit);

        const data = await newsApi.getLatestNews(limit);
        console.log('📊 Latest news data received:', data);
        setNews(data);
      } catch (err) {
        console.error('❌ Error fetching latest news:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch latest news');
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, [limit]);

  return { news, loading, error };
}