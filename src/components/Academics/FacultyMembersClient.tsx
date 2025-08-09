// src/components/Academics/FacultyMembersClient.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { useFaculty } from '@/hooks/useFaculty';
import { facultyApiService, FacultyMember } from '@/lib/facultyApi';

const FacultyMembersClient = () => {
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("all");
  
  // Use the custom hook to fetch faculty data
  const { facultyMembers, loading, error, refetch } = useFaculty();

  // Handle card click to show details
  const handleReadMore = useCallback((id: number) => {
    setShowDetails(id);
  }, []);

  // Close details modal
  const closeDetails = useCallback(() => {
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

  // Get unique designations for filter
  const uniqueDesignations = useMemo(() => {
    const designations = facultyMembers.map(faculty => faculty.designation);
    return Array.from(new Set(designations)).sort();
  }, [facultyMembers]);

  // Filter faculty members based on search and designation
  const filteredFacultyMembers = useMemo(() => {
    return facultyMembers.filter(faculty => {
      const matchesSearch = faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           faculty.designation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDesignation = selectedDesignation === "all" || 
                                faculty.designation === selectedDesignation;
      return matchesSearch && matchesDesignation;
    });
  }, [facultyMembers, searchTerm, selectedDesignation]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Our Faculty Members
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Distinguished educators and researchers dedicated to excellence in teaching and advancing knowledge in their fields.
              </p>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading faculty members...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Our Faculty Members
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Distinguished educators and researchers dedicated to excellence in teaching and advancing knowledge in their fields.
              </p>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6 text-lg">{error}</p>
            <button
              onClick={refetch}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get selected faculty member
  const selectedFaculty = showDetails !== null ? facultyMembers.find(f => f.id === showDetails) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Our Faculty Members
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Distinguished educators and researchers dedicated to excellence in teaching and advancing knowledge in their fields.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 text-white">
                <span className="font-medium">{facultyMembers.length}</span> Faculty Members
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search faculty members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center space-x-4">
              <label htmlFor="designation-filter" className="text-sm font-medium text-gray-700">
                Filter by Position:
              </label>
              <select
                id="designation-filter"
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="all">All Positions</option>
                {uniqueDesignations.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              Showing {filteredFacultyMembers.length} of {facultyMembers.length} members
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredFacultyMembers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No faculty members found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredFacultyMembers.map((faculty, index) => (
              <div
                key={faculty.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Faculty Image */}
                <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <Image
                    src={facultyApiService.getImageUrl(faculty)}
                    alt={faculty.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `/api/placeholder/400/500?text=${encodeURIComponent(faculty.name)}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Overlay content */}
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    {faculty.bio && (
                      <button
                        onClick={() => handleReadMore(faculty.id)}
                        className="w-full px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 rounded-lg transition-all duration-200 font-medium"
                      >
                        Read More
                      </button>
                    )}
                  </div>
                </div>

                {/* Faculty Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    {faculty.name}
                  </h3>
                  <p className="text-indigo-600 font-medium mb-3 text-sm uppercase tracking-wide">
                    {faculty.designation}
                  </p>
                  
                  {faculty.email && (
                    <div className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a 
                        href={`mailto:${faculty.email}`} 
                        className="text-sm truncate hover:text-indigo-700"
                      >
                        {faculty.email}
                      </a>
                    </div>
                  )}

                  {/* Read More Button for Mobile */}
                  {faculty.bio && (
                    <div className="mt-4 sm:hidden">
                      <button
                        onClick={() => handleReadMore(faculty.id)}
                        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 font-medium"
                      >
                        Read More
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Detail Modal */}
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
                {/* Image Section */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent via-70% to-transparent opacity-20"></div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:col-span-3 p-8">
                  <div className="h-full flex flex-col">
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <h5 className="font-semibold text-indigo-900 mb-2">Position</h5>
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

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default FacultyMembersClient;