// hooks/useFaculty.ts
'use client';

import { useState, useEffect } from 'react';
import { facultyApiService, FacultyMember } from '@/lib/facultyApi';

interface UseFacultyReturn {
  facultyMembers: FacultyMember[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFaculty = (): UseFacultyReturn => {
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFacultyMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await facultyApiService.getFacultyMembers();
      setFacultyMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error in useFaculty hook:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyMembers();
  }, []);

  const refetch = async () => {
    await fetchFacultyMembers();
  };

  return {
    facultyMembers,
    loading,
    error,
    refetch,
  };
};

// Hook for individual faculty member
interface UseFacultyMemberReturn {
  facultyMember: FacultyMember | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFacultyMember = (id: number): UseFacultyMemberReturn => {
  const [facultyMember, setFacultyMember] = useState<FacultyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFacultyMember = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await facultyApiService.getFacultyMember(id);
      setFacultyMember(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error in useFacultyMember hook:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFacultyMember();
    }
  }, [id]);

  const refetch = async () => {
    await fetchFacultyMember();
  };

  return {
    facultyMember,
    loading,
    error,
    refetch,
  };
};