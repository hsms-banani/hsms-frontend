// src/components/HomePage/DynamicRectorMessage.tsx - Static Version (Updated Export Names)
'use client';

import React from 'react';
import Image from 'next/image';

interface RectorMessageData {
  id: number;
  name: string;
  position: string;
  image_url: string;
  quote: string;
  paragraphs: Array<{
    id: number;
    content: string;
    order: number;
  }>;
}

interface StaticRectorMessageProps {
  isFullPage?: boolean;
  showTitle?: boolean;
}

// Static rector data - customize this with your own content
const rectorData: RectorMessageData = {
  id: 1,
  name: "Rev. Dr. John Smith", // Replace with actual rector name
  position: "Rector & Principal", // Replace with actual position
  image_url: "/images/rector/rector-photo.jpg", // Place rector photo in public/images/rector/
  quote: "Education is the most powerful weapon which you can use to change the world. Through faith and knowledge, we prepare our students for a life of service and leadership.", // Replace with actual quote
  paragraphs: [
    {
      id: 1,
      content: "Welcome to Holy Spirit Major Seminary Banani, where we are dedicated to forming servant-leaders through comprehensive theological education and spiritual formation. Our institution has been a beacon of excellence in education, nurturing young minds and fostering a deep understanding of faith and service.",
      order: 1
    },
    {
      id: 2,
      content: "Our seminary community is built on the foundation of faith, scholarship, and service, creating an environment where future clergy can develop their theological understanding, pastoral skills, and spiritual maturity. We believe in holistic development that encompasses academic excellence, spiritual growth, and character formation.",
      order: 2
    },
    {
      id: 3,
      content: "As we continue our mission of educational excellence, we remain committed to providing our students with the tools and guidance they need to become effective leaders in their communities. Our dedicated faculty and staff work tirelessly to ensure that each student receives personalized attention and support throughout their journey.",
      order: 3
    },
    {
      id: 4,
      content: "I invite you to explore all that our seminary has to offer and to join us in our commitment to academic excellence, spiritual development, and service to others. Together, we can build a brighter future for our community and our world.",
      order: 4
    }
  ]
};

// Component for rendering individual paragraphs
const RectorParagraph: React.FC<{
  content: string;
  isFirst?: boolean;
  className?: string;
}> = ({ content, isFirst = false, className = '' }) => {
  // Pure black text with drop cap for first paragraph
  const baseClasses = isFirst 
    ? 'text-lg text-black leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-indigo-600 first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:mt-1'
    : 'text-lg text-black leading-relaxed';

  return (
    <div className={`paragraph-wrapper ${className}`}>
      <p className={baseClasses}>
        {content}
      </p>
    </div>
  );
};

// Component for rendering the rector quote
const RectorQuote: React.FC<{ quote: string }> = ({ quote }) => {
  return (
    <blockquote className="text-xl md:text-2xl text-black italic font-light leading-relaxed mb-8 border-l-4 border-indigo-200 pl-6">
      "{quote}"
    </blockquote>
  );
};

export const DynamicRectorMessage: React.FC<StaticRectorMessageProps> = ({ 
  isFullPage = false, 
  showTitle = true 
}) => {
  const rector = rectorData;
  
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
                  <Image
                    src={rector.image_url}
                    alt={`${rector.name} - Seminary Rector`}
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    fill
                    priority={isFullPage}
                    sizes="(max-width: 768px) 192px, 224px"
                  />
                  
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
                <RectorQuote quote={rector.quote} />
                
                {/* Main content - All paragraphs */}
                <div className="message-content space-y-6">
                  {rector.paragraphs
                    .sort((a, b) => a.order - b.order)
                    .map((paragraph, index) => (
                      <RectorParagraph 
                        key={`paragraph-${paragraph.id}`}
                        content={paragraph.content}
                        isFirst={index === 0} // Only first paragraph gets drop cap
                        className={`paragraph-${index + 1}`}
                      />
                    ))
                  }
                </div>
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
                        <p className="text-black mt-2">Holy Spirit Major Seminary Banani</p>
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