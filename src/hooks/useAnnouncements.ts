// hooks/useAnnouncements.ts
import { useState, useEffect, useCallback } from 'react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: number;
  created_at: string;
  updated_at: string;
  start_date: string;
  end_date: string | null;
  attachment?: string;
  attachment_url?: string;
  attachment_name?: string;
  attachment_size?: string;
  attachment_type?: string;
}

interface TickerItem {
  id: number;
  title: string;
  content: string;
}

interface AnnouncementResponse {
  ticker_text: string;
  ticker_items: TickerItem[];
  announcements: Announcement[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.hsms-banani.org';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicker = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/announcements/api/announcements/ticker/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: AnnouncementResponse = await response.json();
      
      setTickerItems(data.ticker_items || []);
      setAnnouncements(data.announcements || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch announcements';
      setError(errorMessage);
      
      // Fallback data for development
      const fallbackData: TickerItem[] = [
        { id: 1, title: "Applications Open for Fall 2025 Spiritual Formation Program", content: "" },
        { id: 2, title: "Holy Week Retreat: April 12-19", content: "" },
        { id: 3, title: "Ordination Ceremony: May 15th", content: "" }
      ];
      setTickerItems(fallbackData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllAnnouncements = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/announcements/api/announcements/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Announcement[] = await response.json();
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch announcements';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAnnouncement = useCallback(async (id: number): Promise<Announcement | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/api/announcements/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Announcement = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to fetch announcement:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchTicker();
    
    // Refresh announcements every 5 minutes
    const interval = setInterval(fetchTicker, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchTicker]);

  return {
    announcements,
    tickerItems,
    isLoading,
    error,
    refetch: fetchTicker,
    fetchAllAnnouncements,
    fetchAnnouncement,
  };
};

export const useAnnouncementDetail = (id: number) => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/announcements/api/announcements/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Announcement not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Announcement = await response.json();
        setAnnouncement(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch announcement');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  return {
    announcement,
    isLoading,
    error,
  };
};