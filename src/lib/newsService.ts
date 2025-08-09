// src/lib/newsService.ts - New file to avoid import conflicts
import { NewsItem, NewsListResponse } from '@/types/news';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

console.log('🔧 NewsService initialized with API_BASE_URL:', API_BASE_URL);

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

    console.log(`📊 Response status: ${response.status}`);

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

class NewsService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/news`;
    console.log('🏗️ NewsService baseURL:', this.baseURL);
  }

  // Test different endpoint patterns to find the right one
  private async findWorkingEndpoint(endpoints: string[]): Promise<string | null> {
    for (const endpoint of endpoints) {
      try {
        console.log(`🧪 Testing endpoint: ${endpoint}`);
        const response = await fetch(endpoint, { method: 'HEAD' });
        if (response.ok) {
          console.log(`✅ Working endpoint found: ${endpoint}`);
          return endpoint;
        }
      } catch (error) {
        console.log(`❌ Endpoint ${endpoint} failed`);
      }
    }
    return null;
  }

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

    // Try different URL patterns
    const possibleUrls = [
      `${this.baseURL}/?${searchParams.toString()}`,
      `${API_BASE_URL}/news/?${searchParams.toString()}`,
      `${API_BASE_URL}/api/news/?${searchParams.toString()}`,
    ];

    let lastError: Error | null = null;

    for (const url of possibleUrls) {
      try {
        return await fetchWithErrorHandling(url);
      } catch (error) {
        console.log(`❌ Failed with URL: ${url}`);
        lastError = error as Error;
      }
    }

    throw lastError || new NewsApiError('All endpoints failed');
  }

  async getNewsDetail(slug: string): Promise<NewsItem> {
    const possibleUrls = [
      `${this.baseURL}/${slug}/`,
      `${API_BASE_URL}/news/${slug}/`,
      `${API_BASE_URL}/api/news/${slug}/`,
    ];

    let lastError: Error | null = null;

    for (const url of possibleUrls) {
      try {
        return await fetchWithErrorHandling(url);
      } catch (error) {
        console.log(`❌ Failed with URL: ${url}`);
        lastError = error as Error;
      }
    }

    throw lastError || new NewsApiError('All endpoints failed');
  }

  async getLatestNews(limit: number = 5): Promise<NewsItem[]> {
    // Try multiple endpoint patterns for latest news
    const possibleUrls = [
      `${this.baseURL}/latest/?limit=${limit}`,
      `${API_BASE_URL}/news/latest/?limit=${limit}`,
      `${API_BASE_URL}/api/news/latest/?limit=${limit}`,
      `${this.baseURL}/?page_size=${limit}&ordering=-created_at`,
      `${API_BASE_URL}/news/?page_size=${limit}&ordering=-created_at`,
    ];

    for (const url of possibleUrls) {
      try {
        console.log(`🔄 Trying latest news URL: ${url}`);
        const data = await fetchWithErrorHandling(url);
        
        if (Array.isArray(data)) {
          return data.slice(0, limit);
        }
        
        if (data.results && Array.isArray(data.results)) {
          return data.results.slice(0, limit);
        }
        
        console.log(`⚠️ Unexpected data format from ${url}:`, data);
      } catch (error) {
        console.log(`❌ Failed with latest URL: ${url}`);
      }
    }

    // Final fallback: try regular news list
    try {
      console.log('🔄 Using fallback: regular news list');
      const response = await this.getNewsList({
        page_size: limit,
        page: 1,
      });
      return response.results || [];
    } catch (fallbackError) {
      console.error('❌ All methods failed:', fallbackError);
      return [];
    }
  }

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
export const newsApi = new NewsService();
export { NewsApiError };

export const debugNewsApi = () => {
  console.log('📊 News API Debug Info:', newsApi.getDebugInfo());
};