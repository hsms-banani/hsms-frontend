// src/components/HomePage/RectorMessage.tsx - Enhanced Version
import React from 'react';
import Image from 'next/image';

interface RectorMessageProps {
  isFullPage?: boolean; // Whether this is displayed on a dedicated page
  showTitle?: boolean;  // Whether to show the section title
}

export const RectorMessage: React.FC<RectorMessageProps> = ({ 
  isFullPage = false, 
  showTitle = true 
}) => {
  return (
    <section className={`${isFullPage ? 'py-8' : 'py-16'} bg-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Rector's Message */}
        <div className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="grid md:grid-cols-5 items-center">
            <div className="md:col-span-2 h-full">
              <div className="relative h-full min-h-[300px] md:min-h-[400px]">
                <Image
                  src="/images/rector-portrait.jpg"
                  alt="Seminary Rector - Rev. Fr. Paul Gomes"
                  className="object-cover"
                  fill
                  priority={isFullPage} // Prioritize loading on full page
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
            <div className="md:col-span-3 p-8 md:p-12">
              {showTitle && (
                <div className="flex items-center mb-6">
                  <div className="h-10 w-1 bg-indigo-600 mr-4"></div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Rector's Message
                  </h3>
                </div>
              )}
              
              <div className="prose prose-indigo max-w-none">
                <blockquote className="text-gray-600 italic mb-6 text-lg border-l-4 border-indigo-200 pl-4">
                  "At Holy Spirit Major Seminary, we are dedicated to forming not just scholars, 
                  but servants of God who will lead with wisdom, compassion, and faith in a complex world."
                </blockquote>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Our seminary stands as a beacon of theological excellence and spiritual formation. 
                  We believe in developing the whole person — intellectually, spiritually, pastorally, 
                  and humanly — preparing our students to serve the Church and society with integrity 
                  and profound understanding.
                </p>
                
                {isFullPage && (
                  <>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      For over decades, our institution has been at the forefront of theological education, 
                      adapting to the changing needs of the Church while maintaining our commitment to 
                      traditional values and academic rigor. We foster an environment where critical 
                      thinking meets deep spirituality.
                    </p>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Our faculty consists of distinguished scholars and practitioners who bring both 
                      academic excellence and pastoral experience to their teaching. They mentor our 
                      students not only in theological studies but also in the practical aspects of 
                      ministry and leadership.
                    </p>
                  </>
                )}
                
                <p className="text-gray-700 mb-8 leading-relaxed">
                  We invite you to explore our programs and experience the transformative education 
                  that has prepared generations of leaders to advance the mission of the Church in 
                  the modern world.
                </p>
                
                {/* Signature Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <Image
                        src="/images/rector-signature.png"
                        alt="Rector's Signature"
                        width={120}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">Rev. Fr. Paul Gomes</h4>
                      <p className="text-indigo-600 font-medium">Rector</p>
                      <p className="text-gray-600 text-sm">Holy Spirit Major Seminary</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Call-to-Action for full page */}
        {isFullPage && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Join Our Seminary Community
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Discover how you can be part of our mission to form the next generation 
                of spiritual leaders and servants of God.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/admissions"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Admissions Information
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
                >
                  Contact Us
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RectorMessage;