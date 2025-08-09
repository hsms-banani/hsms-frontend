// lib/facultyApi.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

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
  // Direct array response for simple list
  data?: FacultyMember[];
}

class FacultyApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async getFacultyMembers(): Promise<FacultyMember[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/academics/faculties/members/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Ensure fresh data
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch faculty members: ${response.status} ${response.statusText}`);
      }

      const data: FacultyApiResponse | FacultyMember[] = await response.json();
      
      // Handle both paginated and direct array responses
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
      const response = await fetch(`${this.baseUrl}/api/academics/faculties/members/${id}/`, {
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

  // Helper method to get image URL with fallback
  getImageUrl(faculty: FacultyMember): string {
    if (faculty.image_url) {
      return faculty.image_url;
    }
    if (faculty.image) {
      return faculty.image.startsWith('http') ? faculty.image : `${this.baseUrl}${faculty.image}`;
    }
    // Fallback to placeholder
    return `/api/placeholder/400/400?text=${encodeURIComponent(faculty.name)}`;
  }

  // Helper method to format bio text
  formatBio(bio?: string): string {
    if (!bio) return 'No biography available.';
    
    // Limit bio length for preview
    const maxLength = 150;
    if (bio.length > maxLength) {
      return bio.substring(0, maxLength).trim() + '...';
    }
    return bio;
  }

  // Helper method to check if faculty has contact info
  hasContactInfo(faculty: FacultyMember): boolean {
    return !!(faculty.email);
  }
}

// Export singleton instance
export const facultyApiService = new FacultyApiService();

// Export types for use in components
export type { FacultyMember, FacultyApiResponse };