// components/HomePage/HeroSection.tsx - API with Local Fallback
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
  const [usingFallback, setUsingFallback] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState<{ [key: number]: boolean }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  
  const router = useRouter();
  const API_URL = useRef(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
  const isMountedRef = useRef(true);

  // Your local fallback slides
  const localSlides: HeroSlide[] = [
    {
      id: 1,
      title: "Our Residence",
      subtitle: "Our Residence",
      image_url: "/images/hero/slide1.jpg", // Place your image in public/images/hero/
      order: 1
    },
    {
      id: 2,
      title: "Our School Building",
      subtitle: "Nurturing Future Priests & Religious",
      image_url: "/images/hero/slide2.jpg", // Place your image in public/images/hero/
      order: 2
    },
    {
      id: 3,
      title: "Our Seminary",
      subtitle: "Our Seminary",
      image_url: "/images/hero/slide3.jpg", // Place your image in public/images/hero/
      order: 3
    }
    // Add more slides as needed
  ];

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

  // Fetch hero slides from API
  const loadSlidesFromAPI = useCallback(async () => {
    try {
      const apiEndpoint = `${API_URL.current}/hero/api/active-slides/`;
      console.log('🔄 Trying API:', apiEndpoint);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      console.log('📋 API Response:', data);
      
      if (data.status === 'success' && data.data && data.data.length > 0) {
        const sortedSlides = data.data.sort((a, b) => a.order - b.order);
        
        // Process image URLs
        const processedSlides = sortedSlides.map(slide => ({
          ...slide,
          image_url: slide.image_url.startsWith('http')
            ? slide.image_url
            : `${API_URL.current}${slide.image_url}`
        }));
        
        console.log('✅ Using API slides:', processedSlides.length);
        setSlides(processedSlides);
        setUsingFallback(false);
        initializeImageStates(processedSlides);
        return true;
      } else {
        console.log('⚠️ API returned no slides');
        return false;
      }
    } catch (error) {
      console.log('❌ API failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }, [initializeImageStates]);

  // Load slides (try API first, then fallback to local)
  const loadSlides = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setLoading(true);
    
    // Try API first
    const apiSuccess = await loadSlidesFromAPI();
    
    if (!apiSuccess && isMountedRef.current) {
      // Use local fallback slides
      console.log('🏠 Using local fallback slides');
      setSlides(localSlides);
      setUsingFallback(true);
      initializeImageStates(localSlides);
    }
    
    if (isMountedRef.current) {
      setLoading(false);
    }
  }, [loadSlidesFromAPI, localSlides, initializeImageStates]);

  // Load slides on component mount
  useEffect(() => {
    isMountedRef.current = true;
    loadSlides();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadSlides]);

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
    if (isMountedRef.current) {
      setImageLoadStates(prev => ({ ...prev, [slideId]: true }));
      setImageErrors(prev => ({ ...prev, [slideId]: false }));
    }
  }, []);

  // Handle image error
  const handleImageError = useCallback((slideId: number) => {
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
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 z-50 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-xs">
          {usingFallback ? '🏠 Local Images' : '🌐 API Images'}
        </div>
      )}

      {/* Slides Container */}
      {slides.map((slide, index) => (
        <div 
          key={`slide-${slide.id}-${index}`}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-blue-200">
            {!imageErrors[slide.id] ? (
              <Image
                src={slide.image_url}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover object-center"
                onLoad={() => handleImageLoad(slide.id)}
                onError={() => handleImageError(slide.id)}
                unoptimized={slide.image_url.includes('localhost') || usingFallback}
                sizes="100vw"
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
            
            {/* Loading state for individual images */}
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