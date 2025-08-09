// src/components/Publications/PublicationsGrid.tsx
'use client';

import React, { useState } from 'react';
import { Publication } from '@/types/publications';
import PublicationCard from './PublicationCard';
import PDFViewer from './PDFViewer';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

interface PublicationsGridProps {
  publications: Publication[];
  type: 'ankur' | 'diptto-sakhyo';
  onDownload: (publication: Publication) => void;
  loading?: boolean;
}

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'downloads-desc';

const PublicationsGrid: React.FC<PublicationsGridProps> = ({
  publications,
  type,
  onDownload,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<Publication | null>(null);

  // Filter and sort publications
  const filteredAndSortedPublications = React.useMemo(() => {
    let filtered = publications.filter(pub => {
      const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pub.issue && pub.issue.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFeatured = !showFeaturedOnly || pub.is_featured;
      return matchesSearch && matchesFeatured;
    });

    // Sort publications
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date_published).getTime() - new Date(a.date_published).getTime();
        case 'date-asc':
          return new Date(a.date_published).getTime() - new Date(b.date_published).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'downloads-desc':
          return b.download_count - a.download_count;
        default:
          return 0;
      }
    });

    return filtered;
  }, [publications, searchTerm, sortBy, showFeaturedOnly]);

  const handleViewPDF = (publication: Publication) => {
    setSelectedPDF(publication);
  };

  const handleClosePDF = () => {
    setSelectedPDF(null);
  };

  const handleDownloadPDF = (publication: Publication) => {
    onDownload(publication);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl h-64 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {type === 'ankur' ? 'Ankur: Student Research Papers & Articles' : 'Diptto Sakhyo: Seminary Journal'}
        </h1>
        <p className="text-gray-600">
          {type === 'ankur' 
            ? 'Explore academic research papers and articles by our students'
            : 'Read our official seminary journal with theological insights and academic discourse'
          }
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search publications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400" size={20} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="downloads-desc">Most Downloaded</option>
          </select>
        </div>

        {/* Featured filter */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showFeaturedOnly}
            onChange={(e) => setShowFeaturedOnly(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Featured Only</span>
        </label>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredAndSortedPublications.length} of {publications.length} publications
        </p>
      </div>

      {/* Publications Grid */}
      {filteredAndSortedPublications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPublications.map((publication) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              type={type}
              onView={handleViewPDF}
              onDownload={handleDownloadPDF}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No publications found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || showFeaturedOnly
              ? 'Try adjusting your search criteria or filters'
              : 'No publications available at the moment'
            }
          </p>
          {(searchTerm || showFeaturedOnly) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setShowFeaturedOnly(false);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* PDF Viewer Modal */}
      {selectedPDF && (
        <PDFViewer
          pdfUrl={selectedPDF.file_url}
          title={selectedPDF.title}
          isOpen={true}
          onClose={handleClosePDF}
        />
      )}
    </div>
  );
};

export default PublicationsGrid;