// components/HomePage/HeroSection.tsx - Alternative approach
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string | null;
  image_url: string;
  order: number;
}

interface ApiResponse {
  status: string;
  count: number;
  data: HeroSlide[];
}

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadStates, setImageLoadStates] = useState<{ [key: number]: boolean }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const [forceRefresh, setForceRefresh] = useState(0); // Add this to force refresh
  
  const router = useRouter();
  const API_URL = useRef(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
  const isMountedRef = useRef(true);
  const hasFetchedRef = useRef(false); // Track if we've fetched data

  // Fallback slides with working images
  const fallbackSlides: HeroSlide[] = [
    {
      id: 1,
      title: "Empowering Future Leaders",
      subtitle: "Our students excel in academics, arts, and athletics",
      image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      order: 1
    },
    {
      id: 2,
      title: "Academic Excellence",
      subtitle: "Rigorous curriculum designed for success",
      image_url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      order: 2
    }
  ];

  // Force refresh images when navigating to home
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.location.pathname === '/') {
        console.log('🏠 Navigated to home, forcing refresh');
        setForceRefresh(prev => prev + 1);
        hasFetchedRef.current = false;
        setImageLoadStates({});
        setImageErrors({});
      }
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Reset all states when component mounts
  const resetStates = useCallback(() => {
    setCurrentSlide(0);
    setLoading(true);
    setError(null);
    setImageLoadStates({});
    setImageErrors({});
  }, []);

  // Initialize image states for slides
  const initializeImageStates = useCallback((slidesData: HeroSlide[]) => {
    const initialLoadStates: { [key: number]: boolean } = {};
    const initialErrorStates: { [key: number]: boolean } = {};
    
    slidesData.forEach((slide) => {
      initialLoadStates[slide.id] = false;
      initialErrorStates[slide.id] = false;
    });
    
    setImageLoadStates(initialLoadStates);
    setImageErrors(initialErrorStates);
  }, []);

  // Fetch hero slides
  const loadSlides = useCallback(async () => {
    if (!isMountedRef.current || hasFetchedRef.current) return;
    
    hasFetchedRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const apiEndpoint = `${API_URL.current}/hero/api/active-slides/`;
      console.log('🔄 Fetching from:', apiEndpoint);
      
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store', // Force fresh data
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      console.log('📋 API Response:', data);
      
      if (!isMountedRef.current) return;
      
      if (data.status === 'success' && data.data && data.data.length > 0) {
        const sortedSlides = data.data.sort((a, b) => a.order - b.order);
        
        // Process image URLs with cache busting
        const processedSlides = sortedSlides.map(slide => ({
          ...slide,
          image_url: slide.image_url.startsWith('http')
            ? `${slide.image_url}?v=${Date.now()}` // Add cache busting
            : `${API_URL.current}${slide.image_url}?v=${Date.now()}`
        }));
        
        console.log('✅ Processed slides:', processedSlides);
        setSlides(processedSlides);
        initializeImageStates(processedSlides);
        
      } else {
        console.log('⚠️ No slides found, using fallback');
        setSlides(fallbackSlides);
        initializeImageStates(fallbackSlides);
      }
    } catch (error) {
      console.error('❌ Error fetching hero slides:', error);
      if (isMountedRef.current) {
        setError(`Failed to load: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setSlides(fallbackSlides);
        initializeImageStates(fallbackSlides);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [initializeImageStates, fallbackSlides]);

  // Effect to load slides on mount or force refresh
  useEffect(() => {
    isMountedRef.current = true;
    hasFetchedRef.current = false;
    resetStates();
    loadSlides();

    return () => {
      isMountedRef.current = false;
    };
  }, [forceRefresh]); // Add forceRefresh as dependency

  // Auto-advance slides
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const interval = setInterval(() => {
      if (isMountedRef.current) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 6000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  // Handle image load
  const handleImageLoad = useCallback((slideId: number) => {
    console.log('✅ Image loaded for slide:', slideId);
    if (isMountedRef.current) {
      setImageLoadStates(prev => ({ ...prev, [slideId]: true }));
      setImageErrors(prev => ({ ...prev, [slideId]: false }));
    }
  }, []);

  // Handle image error
  const handleImageError = useCallback((slideId: number, slideTitle: string, imageUrl: string) => {
    console.error('❌ Image failed for slide:', slideTitle, imageUrl);
    if (isMountedRef.current) {
      setImageErrors(prev => ({ ...prev, [slideId]: true }));
      setImageLoadStates(prev => ({ ...prev, [slideId]: false }));
    }
  }, []);

  if (loading) {
    return (
      <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading hero content...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Slides Container */}
      {slides.map((slide, index) => (
        <div 
          key={`slide-${slide.id}-${forceRefresh}-${index}`} // Include forceRefresh in key
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image using Next.js Image component */}
          <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-blue-200">
            {!imageErrors[slide.id] ? (
              <Image
                src={slide.image_url}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover object-center"
                onLoad={() => handleImageLoad(slide.id)}
                onError={() => handleImageError(slide.id, slide.title, slide.image_url)}
                unoptimized={slide.image_url.includes('localhost')}
                sizes="100vw"
                key={`image-${slide.id}-${forceRefresh}`} // Force re-render
              />
            ) : (
              /* Fallback gradient background if image fails */
              <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-lg opacity-80">Image temporarily unavailable</p>
                </div>
              </div>
            )}
            
            {/* Loading state */}
            {!imageLoadStates[slide.id] && !imageErrors[slide.id] && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <div className="text-gray-700 text-sm">Loading image...</div>
                </div>
              </div>
            )}
            
            {/* Semi-transparent overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50"></div>
            
            {/* Content Container */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    <span className="drop-shadow-2xl text-shadow-lg">{slide.title}</span>
                  </h1>
                  {slide.subtitle && (
                    <p className="text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto mb-8 leading-relaxed">
                      <span className="drop-shadow-xl opacity-95 text-shadow">{slide.subtitle}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center">
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Navigation Arrows for larger screens */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300 hidden md:block hover:scale-110"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300 hidden md:block hover:scale-110"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}