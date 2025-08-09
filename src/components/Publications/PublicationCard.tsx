// src/components/Publications/PublicationCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { PublicationCardProps } from '@/types/publications';
import { FileText, Download, Eye, Calendar, TrendingUp } from 'lucide-react';

const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  type,
  onView,
  onDownload
}) => {
  const handleView = () => {
    if (onView) {
      onView(publication);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(publication);
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Featured badge */}
      {publication.is_featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            Featured
          </span>
        </div>
      )}

      {/* Thumbnail or PDF Icon */}
      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        {publication.thumbnail_url ? (
          <Image
            src={publication.thumbnail_url}
            alt={publication.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
            <FileText size={64} className="mb-2" />
            <span className="text-sm font-medium">PDF Document</span>
          </div>
        )}
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-3">
            <button
              onClick={handleView}
              className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              title="View PDF"
            >
              <Eye size={20} />
            </button>
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
              title="Download PDF"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {publication.title}
          </h3>
          {publication.issue && (
            <p className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block">
              Issue {publication.issue}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>{publication.formatted_date}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <TrendingUp size={16} className="mr-2" />
              <span>{publication.download_count} downloads</span>
            </div>
            <span className="font-medium">{publication.file_size}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleView}
            className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center font-medium"
          >
            <Eye size={16} className="mr-2" />
            View
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-medium"
          >
            <Download size={16} className="mr-2" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationCard;