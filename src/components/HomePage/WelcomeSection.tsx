import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const WelcomeSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <div className="flex items-center space-x-2">
                <div className="h-1 w-12 bg-indigo-600 rounded"></div>
                <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm">Welcome</span>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Holy Spirit Major Seminary
            </h2>
            
            <p className="text-xl text-gray-600 font-light">
              Cultivating hearts and minds through profound theological education and spiritual formation
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Founded on the principles of academic excellence and spiritual growth, the Holy Spirit Major Seminary 
              offers a transformative educational experience in Theology and Philosophy. We are committed to forming 
              well-rounded individuals who serve the Church and society with wisdom, compassion, and faith.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link href="/about" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out">
                Learn More
              </Link>
              <Link href="/programs" className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition duration-150 ease-in-out">
                Our Programs
              </Link>
            </div>
          </div>
          
          {/* Images */}
          <div className="relative grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="relative h-64 w-full overflow-hidden rounded-t-lg shadow-lg">
                <Image 
                  src="/images/seminary-chapel.jpg" 
                  alt="Seminary Chapel" 
                  className="object-cover"
                  fill
                  priority
                />
              </div>
            </div>
            <div className="relative h-48 overflow-hidden rounded-bl-lg shadow-lg">
              <Image 
                src="/images/theology-class.jpg" 
                alt="Theology Class Discussion" 
                className="object-cover"
                fill
              />
            </div>
            <div className="relative h-48 overflow-hidden rounded-br-lg shadow-lg">
              <Image 
                src="/images/library.jpg" 
                alt="Seminary Library" 
                className="object-cover"
                fill
              />
            </div>
            <div className="absolute -bottom-4 -right-4 h-20 w-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-xl">
              <svg className="h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Theological Excellence</h3>
            <p className="mt-2 text-gray-600">Rigorous academic programs rooted in Catholic tradition and contemporary scholarship.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Spiritual Formation</h3>
            <p className="mt-2 text-gray-600">Comprehensive development of the whole person through prayer, community, and guidance.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Global Perspective</h3>
            <p className="mt-2 text-gray-600">Preparing leaders to serve in diverse contexts with cultural sensitivity and universal values.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;