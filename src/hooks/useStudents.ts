// src/hooks/useStudents.ts (UPDATED)
import { useState, useEffect } from 'react';
import { 
  studentsApi, 
  Student, 
  EnrollmentRequirement, 
  ExamInformation, 
  TuitionFee, 
  Document, 
  FAQ, 
  SpiritualGuidance, 
  CongregationStats,
  StudentFilters 
} from '@/lib/studentsApi';

// Hook for fetching students with flexible filtering
export const useStudents = (filters?: StudentFilters) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await studentsApi.getStudents(filters);
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [filters?.congregation, filters?.diocese, filters?.status, filters?.year_joined]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentsApi.getStudents(filters);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  return { students, loading, error, refetch };
};

// Hook specifically for active students
export const useActiveStudents = (filters?: Omit<StudentFilters, 'status'>) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await studentsApi.getActiveStudents(filters);
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch active students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [filters?.congregation, filters?.diocese, filters?.year_joined]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentsApi.getActiveStudents(filters);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active students');
    } finally {
      setLoading(false);
    }
  };

  return { students, loading, error, refetch };
};

// Hook specifically for graduated students
export const useGraduatedStudents = (filters?: Omit<StudentFilters, 'status'>) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await studentsApi.getGraduatedStudents(filters);
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch graduated students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [filters?.congregation, filters?.diocese, filters?.year_joined]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentsApi.getGraduatedStudents(filters);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch graduated students');
    } finally {
      setLoading(false);
    }
  };

  return { students, loading, error, refetch };
};

// Hook for fetching congregation stats with status filtering
export const useCongregationStats = (status?: string) => {
  const [stats, setStats] = useState<CongregationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await studentsApi.getCongregationStats(status);
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch congregation stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [status]);

  return { stats, loading, error };
};

// Hook for fetching enrollment requirements
export const useEnrollmentRequirements = () => {
  const [requirements, setRequirements] = useState<EnrollmentRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await studentsApi.getEnrollmentRequirements();
        setRequirements(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch enrollment requirements');
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  return { requirements, loading, error };
};

// Hook for fetching exam information
export const useExamInformation = () => {
  const [exams, setExams] = useState<ExamInformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await studentsApi.getExamInformation();
        setExams(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exam information');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return { exams, loading, error };
};

// Hook for fetching tuition fees
export const useTuitionFees = () => {
  const [fees, setFees] = useState<TuitionFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await studentsApi.getTuitionFees();
        setFees(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tuition fees');
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  return { fees, loading, error };
};

// Hook for fetching documents
export const useDocuments = (category?: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await studentsApi.getDocuments(category);
        setDocuments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [category]);

  return { documents, loading, error };
};

// Hook for fetching FAQs
export const useFAQs = (category?: string) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await studentsApi.getFAQs(category);
        setFaqs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch FAQs');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [category]);

  return { faqs, loading, error };
};

// Hook for fetching spiritual guidance
export const useSpiritualGuidance = () => {
  const [guidance, setGuidance] = useState<SpiritualGuidance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuidance = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await studentsApi.getSpiritualGuidance();
        setGuidance(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch spiritual guidance');
      } finally {
        setLoading(false);
      }
    };

    fetchGuidance();
  }, []);

  return { guidance, loading, error };
};