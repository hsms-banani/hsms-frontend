// src/types/news.ts
export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url?: string;
  category?: NewsCategory;
  author_name: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  views_count: number;
  read_time: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface NewsPagination {
  count: number;
  next?: string;
  previous?: string;
  currentPage: number;
  totalPages: number;
}

export interface NewsListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: NewsItem[];
}

export interface NewsFilters {
  search?: string;
  category?: string;
  featured?: boolean;
  page?: number;
  page_size?: number;
  ordering?: string;
}