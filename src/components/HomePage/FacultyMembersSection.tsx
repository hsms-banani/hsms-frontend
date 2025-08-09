// components/HomePage/FacultyMembersSection.tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { useFaculty } from '@/hooks/useFaculty';
import { facultyApiService, FacultyMember } from '@/lib/facultyApi';

export const FacultyMembersSection = () => {
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const splideRef = useRef<any>(null);
  
  // Use the custom hook to fetch faculty data
  const { facultyMembers, loading, error, refetch } = useFaculty();

  // Handle card click to show details using event delegation
  const handleReadMore = useCallback((facultyId: number) => {
    console.log('Read More clicked for faculty ID:', facultyId);
    setShowDetails(facultyId);
  }, []);

  // Close details modal
  const closeDetails = useCallback(() => {
    console.log('Closing modal');
    setShowDetails(null);
  }, []);

  // Handle modal backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeDetails();
    }
  }, [closeDetails]);

  // Prevent event bubbling for modal content
  const handleModalContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Event delegation handler for the entire carousel
  const handleCarouselClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Find the closest button with data-faculty-id
    const button = target.closest('[data-faculty-id]') as HTMLButtonElement;
    
    if (button && button.dataset.facultyId) {
      e.preventDefault();
      e.stopPropagation();
      
      const facultyId = parseInt(button.dataset.facultyId, 10);
      console.log('Event delegation - Button clicked for faculty:', facultyId);
      handleReadMore(facultyId);
    }
  }, [handleReadMore]);

  // Set up event delegation when component mounts
  useEffect(() => {
    const splideElement = splideRef.current?.splide?.root;
    
    if (splideElement) {
      splideElement.addEventListener('click', handleCarouselClick);
      
      return () => {
        splideElement.removeEventListener('click', handleCarouselClick);
      };
    }
  }, [handleCarouselClick, facultyMembers]); // Re-run when faculty data changes

  // Enhanced Splide options with better loop handling
  const splideOptions = {
    type: 'loop' as const,
    perPage: 4,
    perMove: 1,
    gap: '1rem',
    pagination: true,
    arrows: true,
    autoplay: true,
    interval: 4000, // Slightly longer interval
    pauseOnHover: true,
    pauseOnFocus: true,
    resetProgress: false,
    // Ensure proper cloning behavior
    clones: 2,
    cloneStatus: true,
    // Improve accessibility
    keyboard: 'global',
    wheel: true,
    wheelSleep: 300,
    breakpoints: {
      1024: {
        perPage: 3,
      },
      768: {
        perPage: 2,
      },
      640: {
        perPage: 1,
      }
    }
  };

  // Create faculty card component to ensure consistent rendering
  const FacultyCard = useCallback(({ faculty }: { faculty: FacultyMember }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col mx-2">
      <div className="relative h-56 bg-gray-200">
        <Image
          src={facultyApiService.getImageUrl(faculty)}
          alt={faculty.name}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `/api/placeholder/400/400?text=${encodeURIComponent(faculty.name)}`;
          }}
        />
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{faculty.name}</h3>
          <p className="text-gray-600 italic mb-2">{faculty.designation}</p>
          {faculty.email && (
            <p className="text-sm text-indigo-600 hover:text-indigo-800">
              <a href={`mailto:${faculty.email}`} className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {faculty.email}
              </a>
            </p>
          )}
        </div>
        {faculty.bio && (
          <button
            type="button"
            data-faculty-id={faculty.id}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors duration-300 self-end focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label={`Read more about ${faculty.name}`}
          >
            Read More
          </button>
        )}
      </div>
    </div>
  ), []);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Faculty Members</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Distinguished educators and researchers dedicated to excellence in teaching and advancing knowledge in their fields.
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading faculty members...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Faculty Members</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Distinguished educators and researchers dedicated to excellence in teaching and advancing knowledge in their fields.
            </p>
          </div>
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!facultyMembers || facultyMembers.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Faculty Members</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Distinguished educators and researchers dedicated to excellence in teaching and advancing knowledge in their fields.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">No faculty members available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  // Get selected faculty member
  const selectedFaculty = showDetails !== null ? facultyMembers.find(f => f.id === showDetails) : null;

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Faculty Members</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Distinguished educators and researchers dedicated to excellence in teaching and advancing knowledge in their fields.
          </p>
        </div>

        {/* Splide Carousel with Event Delegation */}
        <div className="relative">
          <Splide
            ref={splideRef}
            options={splideOptions}
            aria-label="Faculty Members Carousel"
            hasTrack={false}
          >
            <div className="splide__arrows">
              <button className="splide__arrow splide__arrow--prev" aria-label="Previous slide">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="splide__arrow splide__arrow--next" aria-label="Next slide">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <SplideTrack>
              {facultyMembers.map((faculty) => (
                <SplideSlide key={`faculty-${faculty.id}`}>
                  <FacultyCard faculty={faculty} />
                </SplideSlide>
              ))}
            </SplideTrack>
            
            <div className="splide__progress mt-4">
              <div className="splide__progress__bar" />
            </div>
          </Splide>
        </div>

        {/* Enhanced Detail Modal with Beautiful Design */}
        {showDetails !== null && selectedFaculty && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-all duration-300"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="faculty-modal-title"
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100"
              onClick={handleModalContentClick}
            >
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6">
                <div className="flex justify-between items-start">
                  <div className="text-white">
                    <h3 id="faculty-modal-title" className="text-3xl font-bold mb-2">
                      {selectedFaculty.name}
                    </h3>
                    <p className="text-indigo-100 text-lg font-medium">
                      {selectedFaculty.designation}
                    </p>
                    {selectedFaculty.email && (
                      <div className="mt-3">
                        <a 
                          href={`mailto:${selectedFaculty.email}`} 
                          className="inline-flex items-center text-white bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-all duration-200 text-sm backdrop-blur-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Contact via Email
                        </a>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={closeDetails}
                    className="text-white hover:text-indigo-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    aria-label="Close modal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                  {/* Image Section - Standard Professional Size */}
                  <div className="lg:col-span-2 bg-gray-50">
                    <div className="relative h-96 lg:h-[500px] w-full">
                      <Image
                        src={facultyApiService.getImageUrl(selectedFaculty)}
                        alt={selectedFaculty.name}
                        fill
                        className="object-cover object-top"
                        priority
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `/api/placeholder/400/500?text=${encodeURIComponent(selectedFaculty.name)}`;
                        }}
                      />
                      {/* Elegant overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent via-70% to-transparent opacity-20"></div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:col-span-3 p-8">
                    <div className="h-full flex flex-col">
                      {/* Biography Section */}
                      <div className="flex-grow">
                        <div className="mb-6">
                          <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Biography
                          </h4>
                          <div className="prose prose-lg max-w-none text-gray-700">
                            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-indigo-500">
                              <p className="leading-relaxed whitespace-pre-line text-gray-800">
                                {selectedFaculty.bio || 'No biography available at the moment. Please check back later for more information about this distinguished faculty member.'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Additional Info Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className="bg-indigo-50 rounded-lg p-4">
                            <h5 className="font-semibold text-indigo-900 mb-2">Designation</h5>
                            <p className="text-indigo-700">{selectedFaculty.designation}</p>
                          </div>
                          {selectedFaculty.email && (
                            <div className="bg-blue-50 rounded-lg p-4">
                              <h5 className="font-semibold text-blue-900 mb-2">Contact</h5>
                              <a 
                                href={`mailto:${selectedFaculty.email}`}
                                className="text-blue-700 hover:text-blue-900 transition-colors text-sm break-all"
                              >
                                {selectedFaculty.email}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        {selectedFaculty.email && (
                          <a
                            href={`mailto:${selectedFaculty.email}`}
                            className="inline-flex items-center px-4 py-2 bg-white border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Send Email
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={closeDetails}
                          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FacultyMembersSection;