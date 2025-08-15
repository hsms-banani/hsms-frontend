// lib/facultyApi.ts - UPDATED
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'https://hsms-banani.org';

export interface FacultyMember {
  id: number;
  name: string;
  designation: string;
  bio?: string;
  email?: string;
  image?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface FacultyApiResponse {
  results?: FacultyMember[];
  count?: number;
  next?: string;
  previous?: string;
  data?: FacultyMember[];
}

class FacultyApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    console.log('FacultyApiService initialized with baseUrl:', this.baseUrl);
  }

  async getFacultyMembers(): Promise<FacultyMember[]> {
    try {
      const url = `${this.baseUrl}/api/academics/faculties/members/`;
      console.log('Fetching faculty members from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch faculty members: ${response.status} ${response.statusText}`);
      }

      const data: FacultyApiResponse | FacultyMember[] = await response.json();
      
      if (Array.isArray(data)) {
        return data;
      } else if (data.results) {
        return data.results;
      } else if (data.data) {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching faculty members:', error);
      throw error;
    }
  }

  async getFacultyMember(id: number): Promise<FacultyMember> {
    try {
      const url = `${this.baseUrl}/api/academics/faculties/members/${id}/`;
      console.log('Fetching faculty member from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch faculty member: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching faculty member with id ${id}:`, error);
      throw error;
    }
  }

  getImageUrl(faculty: FacultyMember): string {
    if (faculty.image_url) {
      return faculty.image_url;
    }
    if (faculty.image) {
      return faculty.image.startsWith('http') ? faculty.image : `${this.baseUrl}${faculty.image}`;
    }
    return `/api/placeholder/400/400?text=${encodeURIComponent(faculty.name)}`;
  }

  formatBio(bio?: string): string {
    if (!bio) return 'No biography available.';
    
    const maxLength = 150;
    if (bio.length > maxLength) {
      return bio.substring(0, maxLength).trim() + '...';
    }
    return bio;
  }

  hasContactInfo(faculty: FacultyMember): boolean {
    return !!(faculty.email);
  }
}

export const facultyApiService = new FacultyApiService();
export type { FacultyMember, FacultyApiResponse };