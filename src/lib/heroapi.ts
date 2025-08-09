// lib/heroapi.ts
export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  order: number;
}

export interface ApiResponse {
  status: string;
  count: number;
  data: HeroSlide[];
}

// Get API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Fallback slides in case API fails
export const fallbackSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Empowering Future Leaders",
    subtitle: "Our students excel in academics, arts, and athletics",
    image_url: "https://via.placeholder.com/1920x800/1E40AF/FFFFFF?text=Empowering+Future+Leaders",
    cta_text: "Apply Now",
    cta_link: "/admissions/apply",
    order: 1
  },
  {
    id: 2,
    title: "Academic Excellence",
    subtitle: "Rigorous curriculum designed for success in college and beyond",
    image_url: "https://via.placeholder.com/1920x800/0E7490/FFFFFF?text=Academic+Excellence",
    cta_text: "Explore Programs",
    cta_link: "/academics",
    order: 2
  },
  {
    id: 3,
    title: "Join Our Community",
    subtitle: "A nurturing environment where students thrive and grow",
    image_url: "https://via.placeholder.com/1920x800/065F46/FFFFFF?text=Join+Our+Community",
    cta_text: "Schedule a Visit",
    cta_link: "/admissions/visit",
    order: 3
  }
];

// Fetch hero slides from Django API
export async function fetchHeroSlides(): Promise<{ slides: HeroSlide[]; error: string | null }> {
  try {
    const apiEndpoint = `${API_URL}/hero/api/active-slides/`;
    console.log('Fetching from:', apiEndpoint);
    
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      // Add cache control for better performance
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse = await response.json();
    
    console.log('API Response:', data);
    
    if (data.status === 'success' && data.data && data.data.length > 0) {
      // Sort slides by order
      const sortedSlides = data.data.sort((a, b) => a.order - b.order);
      
      sortedSlides.forEach((slide, index) => {
        console.log(`Slide ${index + 1}:`, {
          title: slide.title,
          image_url: slide.image_url,
        });
      });
      
      return { slides: sortedSlides, error: null };
    } else {
      console.log('No slides found in API response, using fallback');
      return { slides: fallbackSlides, error: null };
    }
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    const errorMessage = `Failed to load hero slides: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return { slides: fallbackSlides, error: errorMessage };
  }
}

// Utility function to check if image URL is accessible
export async function checkImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors' // This helps with CORS issues
    });
    return true;
  } catch (error) {
    console.warn('Image URL check failed:', url, error);
    return false;
  }
}