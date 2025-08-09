// src/lib/newsApi.ts
import { NewsItem, NewsListResponse } from '@/types/news';

// Use consistent environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class NewsApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'NewsApiError';
  }
}

async function fetchWithErrorHandling(url: string, options?: RequestInit) {
  try {
    console.log('🔄 Fetching from URL:', url);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      console.error(`❌ HTTP error! status: ${response.status}, url: ${url}`);
      throw new NewsApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    console.log('✅ API Response data:', data);
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    if (error instanceof NewsApiError) {
      throw error;
    }
    throw new NewsApiError('Network error occurred');
  }
}

class NewsAPI {
  private baseURL: string;

  constructor() {
    // Construct the news API URL consistently
    this.baseURL = `${API_BASE_URL}/api/news`;
  }

  // Get paginated list of news
  async getNewsList(params: {
    page?: number;
    page_size?: number;
    search?: string;
    category?: string;
    featured?: boolean;
  } = {}): Promise<NewsListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', String(params.page));
    if (params.page_size) searchParams.append('page_size', String(params.page_size));
    if (params.search) searchParams.append('search', params.search);
    if (params.category) searchParams.append('category', params.category);
    if (params.featured !== undefined) searchParams.append('featured', String(params.featured));

    const url = `${this.baseURL}/?${searchParams.toString()}`;
    return fetchWithErrorHandling(url);
  }

  // Get single news article by slug
  async getNewsDetail(slug: string): Promise<NewsItem> {
    const url = `${this.baseURL}/${slug}/`;
    return fetchWithErrorHandling(url);
  }

  // Get latest news (simplified)
  async getLatestNews(limit: number = 5): Promise<NewsItem[]> {
    try {
      // Try the latest endpoint first
      const url = `${this.baseURL}/latest/?limit=${limit}`;
      const data = await fetchWithErrorHandling(url);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('❌ Error fetching latest news from /latest endpoint:', error);
      
      // Fallback: try to get from regular news list
      try {
        console.log('🔄 Trying fallback with regular news list...');
        const response = await this.getNewsList({
          page_size: limit,
          page: 1,
        });
        return response.results || [];
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        return [];
      }
    }
  }

  // Get news with filters (alternative method name for compatibility)
  async getNews(filters: {
    search?: string;
    category?: string;
    featured?: boolean;
    page?: number;
    page_size?: number;
  } = {}): Promise<NewsListResponse> {
    return this.getNewsList(filters);
  }

  // Get related news
  async getRelatedNews(currentSlug: string, categoryId?: string, limit: number = 3): Promise<NewsItem[]> {
    try {
      const params: any = {
        page_size: limit + 1, // Get one extra to account for filtering out current
        page: 1,
      };
      
      if (categoryId) {
        params.category = categoryId;
      }

      const response = await this.getNewsList(params);
      
      // Filter out current news item and limit results
      const related = (response.results || [])
        .filter(item => item.slug !== currentSlug)
        .slice(0, limit);
      
      return related;
    } catch (error) {
      console.error('❌ Error fetching related news:', error);
      return [];
    }
  }

  // Get categories
  async getCategories(): Promise<any[]> {
    try {
      const url = `${this.baseURL}/categories/`;
      return await fetchWithErrorHandling(url);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      return [];
    }
  }

  // Debug method
  getDebugInfo() {
    return {
      baseURL: this.baseURL,
      API_BASE_URL,
      envVars: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      }
    };
  }
}

// Create and export the instance
export const newsApi = new NewsAPI();

// Export the error class
export { NewsApiError };

// Export the debug function for troubleshooting
export const debugNewsApi = () => {
  console.log('📊 News API Debug Info:', newsApi.getDebugInfo());
};