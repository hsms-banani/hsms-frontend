// src/app/publications/ankur/page.tsx
'use client';

import React from 'react';
import PublicationsGrid from '@/components/Publications/PublicationsGrid';
import { useAnkurPublications } from '@/hooks/usePublications';
import { Publication } from '@/types/publications';

export default function AnkurPublicationsPage() {
  const { publications, loading, error, downloadPublication } = useAnkurPublications();

  const handleDownload = async (publication: Publication) => {
    await downloadPublication(publication.id);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Publications</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <PublicationsGrid
      publications={publications}
      type="ankur"
      onDownload={handleDownload}
      loading={loading}
    />
  );
}