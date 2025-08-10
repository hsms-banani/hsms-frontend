// src/lib/publicationsApi.ts - UPDATED
import { Publication } from '@/types/publications';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.hsms-banani.org';

export interface PublicationResponse {
  results?: Publication[];
  count?: number;
  next?: string;
  previous?: string;
}

class PublicationsAPI {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      console.log('Publications API request to:', url);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Publications API request failed:', error);
      throw error;
    }
  }

  async getAnkurPublications(): Promise<Publication[]> {
    try {
      const data = await this.fetchWithErrorHandling<Publication[]>(
        `${API_BASE_URL}/publications/ankur/`
      );
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch Ankur publications:', error);
      return [];
    }
  }

  async getAnkurPublication(id: number): Promise<Publication | null> {
    try {
      return await this.fetchWithErrorHandling<Publication>(
        `${API_BASE_URL}/publications/ankur/${id}/`
      );
    } catch (error) {
      console.error('Failed to fetch Ankur publication:', error);
      return null;
    }
  }

  async downloadAnkurPublication(id: number): Promise<{ download_url: string } | null> {
    try {
      return await this.fetchWithErrorHandling<{ download_url: string }>(
        `${API_BASE_URL}/publications/ankur/${id}/download/`,
        { method: 'POST' }
      );
    } catch (error) {
      console.error('Failed to track Ankur download:', error);
      return null;
    }
  }

  async getDipttoSakhyoPublications(): Promise<Publication[]> {
    try {
      const data = await this.fetchWithErrorHandling<Publication[]>(
        `${API_BASE_URL}/publications/diptto-sakhyo/`
      );
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch Diptto Sakhyo publications:', error);
      return [];
    }
  }

  async getDipttoSakhyoPublication(id: number): Promise<Publication | null> {
    try {
      return await this.fetchWithErrorHandling<Publication>(
        `${API_BASE_URL}/publications/diptto-sakhyo/${id}/`
      );
    } catch (error) {
      console.error('Failed to fetch Diptto Sakhyo publication:', error);
      return null;
    }
  }

  async downloadDipttoSakhyoPublication(id: number): Promise<{ download_url: string } | null> {
    try {
      return await this.fetchWithErrorHandling<{ download_url: string }>(
        `${API_BASE_URL}/publications/diptto-sakhyo/${id}/download/`,
        { method: 'POST' }
      );
    } catch (error) {
      console.error('Failed to track Diptto Sakhyo download:', error);
      return null;
    }
  }
}

export const publicationsAPI = new PublicationsAPI();