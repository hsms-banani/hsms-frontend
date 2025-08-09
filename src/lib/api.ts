// lib/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiError(
        `Request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }
    
    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

// Specific API functions for announcements
export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: number;
  created_at: string;
  start_date: string;
  end_date: string | null;
}

export interface AnnouncementTickerResponse {
  ticker_text: string;
  announcements: Announcement[];
}

export const announcementApi = {
  getTicker: () => 
    apiRequest<AnnouncementTickerResponse>('/announcements/api/announcements/ticker/'),
  
  getAll: () => 
    apiRequest<Announcement[]>('/announcements/api/announcements/'),
};

