// src/lib/studentsApi.ts (UPDATED)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://hsms-banani.org';
const STUDENTS_API_BASE = `${API_BASE_URL}/students/api/students`;

export interface Student {
  id: number;
  name: string;
  congregation: string;
  diocese: string;
  year_joined: string;
  student_id: string;
  email: string;
  phone: string;
  photo: string;
  photo_url: string | null;
  status: 'active' | 'graduated' | 'transferred' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

export interface EnrollmentRequirement {
  id: number;
  title: string;
  description: string;
  is_mandatory: boolean;
  order: number;
}

export interface ExamInformation {
  id: number;
  title: string;
  description: string;
  exam_date: string;
  exam_time: string | null;
  location: string;
  exam_type: 'midterm' | 'final' | 'entrance' | 'comprehensive';
  exam_datetime: string;
}

export interface TuitionFee {
  id: number;
  title: string;
  amount: string;
  formatted_amount: string;
  description: string;
  academic_year: string;
  fee_type: 'tuition' | 'registration' | 'library' | 'laboratory' | 'accommodation' | 'other';
  due_date: string | null;
}

export interface Document {
  id: number;
  title: string;
  file: string;
  file_url: string | null;
  category: 'forms' | 'requirements' | 'guidelines' | 'handbooks' | 'applications' | 'other';
  description: string;
  is_required: boolean;
  file_size: number | null;
  file_size_formatted: string | null;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: 'admission' | 'academic' | 'financial' | 'student_life' | 'spiritual' | 'general';
  is_featured: boolean;
}

export interface SpiritualGuidance {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: 'prayer' | 'meditation' | 'scripture' | 'reflection' | 'guidance' | 'inspiration';
  is_featured: boolean;
  created_at: string;
}

export interface CongregationStats {
  congregations: Array<{ congregation: string; count: number }>;
  dioceses: Array<{ diocese: string; count: number }>;
  total_students: number;
}

export interface StudentFilters {
  congregation?: string;
  diocese?: string;
  status?: string;
  year_joined?: string;
}

// Utility function for API calls
const apiCall = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // Add cache control if needed
    ...(process.env.NEXT_PUBLIC_CACHE_REVALIDATE && {
      next: { revalidate: parseInt(process.env.NEXT_PUBLIC_CACHE_REVALIDATE) }
    })
  });

  if (!response.ok) {
    const errorMessage = `API Error: ${response.status} ${response.statusText}`;
    
    // Enhanced error handling
    if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
      console.error(`Failed to fetch from ${url}:`, errorMessage);
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
};

// API Functions
export const studentsApi = {
  // Get all students with optional filtering
  getStudents: async (params?: StudentFilters): Promise<Student[]> => {
    const searchParams = new URLSearchParams();
    if (params?.congregation) searchParams.append('congregation', params.congregation);
    if (params?.diocese) searchParams.append('diocese', params.diocese);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.year_joined) searchParams.append('year_joined', params.year_joined);
    
    const queryString = searchParams.toString();
    const url = `${STUDENTS_API_BASE}/list/${queryString ? `?${queryString}` : ''}`;
    
    return apiCall<Student[]>(url);
  },

  // Get graduated students specifically
  getGraduatedStudents: async (params?: Omit<StudentFilters, 'status'>): Promise<Student[]> => {
    const searchParams = new URLSearchParams();
    searchParams.append('status', 'graduated');
    if (params?.congregation) searchParams.append('congregation', params.congregation);
    if (params?.diocese) searchParams.append('diocese', params.diocese);
    if (params?.year_joined) searchParams.append('year_joined', params.year_joined);
    
    const queryString = searchParams.toString();
    const url = `${STUDENTS_API_BASE}/list/?${queryString}`;
    
    return apiCall<Student[]>(url);
  },

  // Get active students specifically  
  getActiveStudents: async (params?: Omit<StudentFilters, 'status'>): Promise<Student[]> => {
    const searchParams = new URLSearchParams();
    searchParams.append('status', 'active');
    if (params?.congregation) searchParams.append('congregation', params.congregation);
    if (params?.diocese) searchParams.append('diocese', params.diocese);
    if (params?.year_joined) searchParams.append('year_joined', params.year_joined);
    
    const queryString = searchParams.toString();
    const url = `${STUDENTS_API_BASE}/list/?${queryString}`;
    
    return apiCall<Student[]>(url);
  },

  // Get congregation and diocese statistics
  getCongregationStats: async (status?: string): Promise<CongregationStats> => {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append('status', status);
    
    const queryString = searchParams.toString();
    const url = `${STUDENTS_API_BASE}/congregations/${queryString ? `?${queryString}` : ''}`;
    return apiCall<CongregationStats>(url);
  },

  // Get enrollment requirements
  getEnrollmentRequirements: async (): Promise<EnrollmentRequirement[]> => {
    const url = `${STUDENTS_API_BASE}/enrollment/`;
    return apiCall<EnrollmentRequirement[]>(url);
  },

  // Get exam information
  getExamInformation: async (): Promise<ExamInformation[]> => {
    const url = `${STUDENTS_API_BASE}/exams/`;
    return apiCall<ExamInformation[]>(url);
  },

  // Get tuition fees
  getTuitionFees: async (): Promise<TuitionFee[]> => {
    const url = `${STUDENTS_API_BASE}/tuition/`;
    return apiCall<TuitionFee[]>(url);
  },

  // Get documents with optional category filtering
  getDocuments: async (category?: string): Promise<Document[]> => {
    const url = `${STUDENTS_API_BASE}/documents/${category ? `?category=${category}` : ''}`;
    return apiCall<Document[]>(url);
  },

  // Get FAQs with optional category filtering
  getFAQs: async (category?: string): Promise<FAQ[]> => {
    const url = `${STUDENTS_API_BASE}/faqs/${category ? `?category=${category}` : ''}`;
    return apiCall<FAQ[]>(url);
  },

  // Get spiritual guidance
  getSpiritualGuidance: async (): Promise<SpiritualGuidance[]> => {
    const url = `${STUDENTS_API_BASE}/spiritual-guidance/`;
    return apiCall<SpiritualGuidance[]>(url);
  },

  // Utility method to get API base URL (useful for debugging)
  getApiBaseUrl: (): string => {
    return STUDENTS_API_BASE;
  },

  // Health check method
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    try {
      // Try to fetch a simple endpoint to check if API is available
      await apiCall<Student[]>(`${STUDENTS_API_BASE}/list/?limit=1`);
      return {
        status: 'healthy',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString()
      };
    }
  }
};