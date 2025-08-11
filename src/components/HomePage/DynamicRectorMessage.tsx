// src/components/HomePage/DynamicRectorMessage.tsx - COMPLETE FIXED VERSION
'use client';

import React from 'react';
import Image from 'next/image';
import { useFeaturedSection } from '@/hooks/useFeaturedSection';
import SafeContentRenderer from '@/components/common/SafeContentRenderer';
import { useSummernoteContent } from '@/hooks/useSummernoteContent';

interface RectorMessageData {
  id: number;
  name: string;
  position: string;
  image_url: string | null;
  quote: string;
  message_paragraph_1: string;
  message_paragraph_2: string;
  all_paragraphs?: Array<{
    id: number;
    content: string;
    order: number;
  }>;
}

interface DynamicRectorMessageProps {
  isFullPage?: boolean;
  showTitle?: boolean;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-100"></div>
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent absolute top-0 left-0"></div>
    </div>
  </div>
);

const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 my-8 backdrop-blur-sm">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-lg font-semibold text-red-800">Unable to load content</h3>
        <div className="mt-2 text-red-700">
          <p>{message}</p>
        </div>
        <div className="mt-4">
          <button
            onClick={onRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Component for rendering individual paragraphs with black text
const RectorParagraph: React.FC<{
  content: string;
  isFirst?: boolean;
  className?: string;
}> = ({ content, isFirst = false, className = '' }) => {
  const { content: processedContent, isValid } = useSummernoteContent(content, {
    preserveFormatting: true,
    allowedTags: ['p', 'br', 'strong', 'em', 'i', 'b', 'u'],
    textStyle: 'paragraph'
  });

  if (!isValid) return null;

  // Pure black text with drop cap for first paragraph
  const baseClasses = isFirst 
    ? 'text-lg text-black leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-indigo-600 first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:mt-1'
    : 'text-lg text-black leading-relaxed';

  return (
    <div className={`paragraph-wrapper ${className}`}>
      <SafeContentRenderer
        content={processedContent.cleaned}
        textStyle="paragraph"
        className={baseClasses}
        allowedTags={['p', 'br', 'strong', 'em', 'i', 'b', 'u']}
        preserveFormatting={true}
      />
    </div>
  );
};

// Component for rendering the rector quote with black text
const RectorQuote: React.FC<{ quote: string }> = ({ quote }) => {
  const { content: processedQuote, isValid } = useSummernoteContent(quote, {
    preserveFormatting: false,
    textStyle: 'quote'
  });

  if (!isValid) return null;

  return (
    <blockquote className="text-xl md:text-2xl text-black italic font-light leading-relaxed mb-8 border-l-4 border-indigo-200 pl-6">
      "{processedQuote.plainText}"
    </blockquote>
  );
};

export const DynamicRectorMessage: React.FC<DynamicRectorMessageProps> = ({ 
  isFullPage = false, 
  showTitle = true 
}) => {
  const { data, loading, error, refetch } = useFeaturedSection();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  if (!data?.rector_message) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto">
          <p className="text-black text-lg">No rector message available at this time</p>
        </div>
      </div>
    );
  }

  const rector: RectorMessageData = data.rector_message;
  
  // FIXED: Use all_paragraphs if available, otherwise fallback to individual paragraph fields
  const paragraphs = rector.all_paragraphs && rector.all_paragraphs.length > 0 
    ? rector.all_paragraphs.sort((a, b) => a.order - b.order)
    : [
        ...(rector.message_paragraph_1?.trim() ? [{ id: 1, content: rector.message_paragraph_1, order: 0 }] : []),
        ...(rector.message_paragraph_2?.trim() ? [{ id: 2, content: rector.message_paragraph_2, order: 1 }] : [])
      ];
  
  const hasValidQuote = rector.quote?.trim();
  const hasValidContent = paragraphs.length > 0 && paragraphs.some(p => p.content?.trim());

  // Debug logging
  console.log('🔍 Rector Message Debug:', {
    rectorName: rector.name,
    totalParagraphs: paragraphs.length,
    hasAllParagraphs: !!(rector.all_paragraphs && rector.all_paragraphs.length > 0),
    paragraphLengths: paragraphs.map(p => ({ order: p.order, length: p.content?.length || 0 })),
    isFullPage,
    hasValidContent
  });

  return (
    <section className={`${isFullPage ? 'py-8' : 'py-16'} bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8 md:p-12 lg:p-16">
            {/* Header */}
            {(showTitle && !isFullPage) && (
              <div className="mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Rector's Message</h3>
              </div>
            )}
            
            {/* Content with floating image */}
            <div className="relative">
              {/* Rector Image */}
              <div className="float-left mr-8 mb-6 group">
                <div className="relative w-48 h-64 md:w-56 md:h-72 rounded-2xl overflow-hidden shadow-xl">
                  {rector.image_url ? (
                    <Image
                      src={rector.image_url}
                      alt={`${rector.name} - Seminary Rector`}
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      fill
                      priority={isFullPage}
                      sizes="(max-width: 768px) 192px, 224px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-gray-500 text-sm font-medium">Rector Photo</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  
                  {/* Name overlay on image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white text-lg font-bold leading-tight">{rector.name}</h4>
                    <p className="text-white/90 text-sm font-medium">{rector.position}</p>
                  </div>
                </div>
              </div>
              
              {/* Text content that wraps around the image */}
              <div className="text-content">
                {/* Quote */}
                {hasValidQuote && <RectorQuote quote={rector.quote} />}
                
                {/* Main content - FIXED: Now renders ALL paragraphs */}
                {hasValidContent ? (
                  <div className="message-content space-y-6">
                    {paragraphs.map((paragraph, index) => {
                      if (!paragraph.content?.trim()) return null;
                      
                      return (
                        <RectorParagraph 
                          key={`paragraph-${paragraph.id}-${paragraph.order}`}
                          content={paragraph.content}
                          isFirst={index === 0} // Only first paragraph gets drop cap
                          className={`paragraph-${index + 1}`}
                        />
                      );
                    })}
                  </div>
                ) : (
                  /* Fallback content with black text */
                  <div className="fallback-content space-y-6">
                    <p className="text-lg leading-relaxed text-black">
                      Welcome to Holy Spirit Major Seminary, where we are dedicated to forming 
                      servant-leaders through comprehensive theological education and spiritual formation.
                    </p>
                    {isFullPage && (
                      <p className="text-lg leading-relaxed text-black">
                        Our seminary community is built on the foundation of faith, scholarship, and service, 
                        creating an environment where future clergy can develop their theological understanding, 
                        pastoral skills, and spiritual maturity.
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Clear float */}
              <div className="clear-both"></div>
              
              {/* Rector info card */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{rector.name}</h4>
                      <p className="text-indigo-600 font-semibold text-lg">{rector.position}</p>
                      {isFullPage && (
                        <p className="text-black mt-2">Holy Spirit Major Seminary</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <span className="text-black font-medium">Leading with Vision & Faith</span>
                    </div>
                  </div>
                  
                  {/* Show paragraph count for debugging in development */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 pt-4 border-t border-indigo-200">
                      <p className="text-sm text-indigo-600">
                        Debug: Displaying {paragraphs.length} paragraph{paragraphs.length !== 1 ? 's' : ''}
                        {rector.all_paragraphs && ` (from all_paragraphs array)`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DynamicRectorMessage;