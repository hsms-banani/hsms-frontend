// src/hooks/usePublications.ts
import { useState, useEffect } from 'react';
import { Publication } from '@/types/publications';
import { publicationsAPI } from '@/lib/publicationsApi';

export const useAnkurPublications = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        const data = await publicationsAPI.getAnkurPublications();
        setPublications(data);
        setError(null);
      } catch (err) {
        setError('Failed to load Ankur publications');
        console.error('Error fetching Ankur publications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const downloadPublication = async (id: number) => {
    try {
      const result = await publicationsAPI.downloadAnkurPublication(id);
      if (result?.download_url) {
        window.open(result.download_url, '_blank');
        // Refresh the publications to get updated download count
        const updatedData = await publicationsAPI.getAnkurPublications();
        setPublications(updatedData);
      }
    } catch (err) {
      console.error('Error downloading publication:', err);
    }
  };

  return {
    publications,
    loading,
    error,
    downloadPublication,
    refetch: () => {
      const fetchPublications = async () => {
        try {
          setLoading(true);
          const data = await publicationsAPI.getAnkurPublications();
          setPublications(data);
          setError(null);
        } catch (err) {
          setError('Failed to load Ankur publications');
        } finally {
          setLoading(false);
        }
      };
      fetchPublications();
    }
  };
};

export const useDipttoSakhyoPublications = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        const data = await publicationsAPI.getDipttoSakhyoPublications();
        setPublications(data);
        setError(null);
      } catch (err) {
        setError('Failed to load Diptto Sakhyo publications');
        console.error('Error fetching Diptto Sakhyo publications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const downloadPublication = async (id: number) => {
    try {
      const result = await publicationsAPI.downloadDipttoSakhyoPublication(id);
      if (result?.download_url) {
        window.open(result.download_url, '_blank');
        // Refresh the publications to get updated download count
        const updatedData = await publicationsAPI.getDipttoSakhyoPublications();
        setPublications(updatedData);
      }
    } catch (err) {
      console.error('Error downloading publication:', err);
    }
  };

  return {
    publications,
    loading,
    error,
    downloadPublication,
    refetch: () => {
      const fetchPublications = async () => {
        try {
          setLoading(true);
          const data = await publicationsAPI.getDipttoSakhyoPublications();
          setPublications(data);
          setError(null);
        } catch (err) {
          setError('Failed to load Diptto Sakhyo publications');
        } finally {
          setLoading(false);
        }
      };
      fetchPublications();
    }
  };
};