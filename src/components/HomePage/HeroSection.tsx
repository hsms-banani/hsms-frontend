// components/HomePage/HeroSection.tsx - Static Images Only
'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string | null;
  image_url: string;
  order: number;
}

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoadStates, setImageLoadStates] = useState<{ [key: number]: boolean }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  // Your static slides - customize these with your images and titles
  const slides: HeroSlide[] = [
    {
      id: 1,
      title: "Welcome to HSMS Banani",
      subtitle: "Excellence in Education Since Our Foundation",
      image_url: "/images/hero/slide1.jpg", // Place your image in public/images/hero/
      order: 1
    },
    {
      id: 2,
      title: "Academic Excellence",
      subtitle: "Nurturing Young Minds for a Brighter Future",
      image_url: "/images/hero/slide2.jpg",
      order: 2
    },
    {
      id: 3,
      title: "Innovation & Learning",
      subtitle: "Modern Facilities and Teaching Methods",
      image_url: "/images/hero/slide3.jpg",
      order: 3
    },
    {
      id: 4,
      title: "Student Life & Activities",
      subtitle: "Building Character Through Co-curricular Programs",
      image_url: "/images/hero/slide4.jpg",
      order: 4
    },
    {
      id: 5,
      title: "Future Ready Education",
      subtitle: "Preparing Students for Tomorrow's Challenges",
      image_url: "/images/hero/slide5.jpg",
      order: 5
    }
  ];

  // Initialize image states
  useEffect(() => {
    const initialLoadStates: { [key: number]: boolean } = {};
    const initialErrorStates: { [key: number]: boolean } = {};
    
    slides.forEach((slide) => {
      initialLoadStates[slide.id] = false;
      initialErrorStates[slide.id] = false;
    });
    
    setImageLoadStates(initialLoadStates);
    setImageErrors(initialErrorStates);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [slides.length]);

  // Handle image load
  const handleImageLoad = useCallback((slideId: number) => {
    setImageLoadStates(prev => ({ ...prev, [slideId]: true }));
    setImageErrors(prev => ({ ...prev, [slideId]: false }));
  }, []);

  // Handle image error
  const handleImageError = useCallback((slideId: number) => {
    setImageErrors(prev => ({ ...prev, [slideId]: true }));
    setImageLoadStates(prev => ({ ...prev, [slideId]: false }));
  }, []);

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
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
                priority={index === 0} // Prioritize first image for faster loading
                className="object-cover object-center"
                onLoad={() => handleImageLoad(slide.id)}
                onError={() => handleImageError(slide.id)}
                sizes="100vw"
              />
            ) : (
              /* Fallback gradient background if image fails */
              <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <div className="text-6xl mb-4">🏫</div>
                  <p className="text-lg opacity-80">HSMS Banani</p>
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

      {/* Navigation Arrows for larger screens */}
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

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 z-30 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        {currentSlide + 1} / {slides.length}
      </div>
    </section>
  );
}