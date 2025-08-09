// src/components/HomePage/FeaturedSection.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const FeaturedSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Excellence in Theological & Philosophical Education
          </h2>
          <div className="mt-4 max-w-3xl mx-auto">
            <p className="text-xl text-gray-600">
              Discover what makes Holy Spirit Major Seminary a center for spiritual and intellectual formation
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-indigo-600 rounded"></div>
          </div>
        </div>

        {/* Rector's Message */}
        <div className="mb-20 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="grid md:grid-cols-5 items-center">
            <div className="md:col-span-2 h-full">
              <div className="relative h-full min-h-[300px] md:min-h-[400px]">
                <Image
                  src="/images/rector-portrait.jpg"
                  alt="Seminary Rector"
                  className="object-cover"
                  fill
                />
              </div>
            </div>
            <div className="md:col-span-3 p-8 md:p-12">
              <div className="flex items-center mb-6">
                <div className="h-10 w-1 bg-indigo-600 mr-4"></div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Rector's Message</h3>
              </div>
              <div className="prose prose-indigo max-w-none">
                <p className="text-gray-600 italic mb-4">
                  "At Holy Spirit Major Seminary, we are dedicated to forming not just scholars, but servants of God who will lead with wisdom, compassion, and faith in a complex world."
                </p>
                <p className="text-gray-700 mb-4">
                  Our seminary stands as a beacon of theological excellence and spiritual formation. We believe in developing the whole person — intellectually, spiritually, pastorally, and humanly — preparing our students to serve the Church and society with integrity and profound understanding.
                </p>
                <p className="text-gray-700 mb-6">
                  We invite you to explore our programs and experience the transformative education that has prepared generations of leaders to advance the mission of the Church in the modern world.
                </p>
                <div className="flex items-center space-x-4">
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
                    <h4 className="font-semibold text-gray-900">Rev. Fr. Paul Gomes</h4>
                    <p className="text-gray-600 text-sm">Rector, Holy Spirit Major Seminary</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Focus */}
        <div className="mb-20">
          <div className="flex items-center mb-10">
            <div className="h-10 w-1 bg-indigo-600 mr-4"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Academic Focus</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Philosophy Department */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
              <div className="relative h-56">
                <Image
                  src="/images/philosophy-department.jpg"
                  alt="Philosophy Department"
                  className="object-cover"
                  fill
                />
                <div className="absolute inset-0 bg-indigo-900 bg-opacity-30"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="inline-block bg-white px-3 py-1 rounded-full text-indigo-700 font-semibold text-sm mb-2">Department</span>
                  <h4 className="text-white text-xl font-bold">Philosophy</h4>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Our Philosophy department offers a rigorous foundation in philosophical inquiry, covering ancient, medieval, modern, and contemporary thought. Students develop critical thinking and analytical skills necessary for theological studies.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Metaphysics & Epistemology</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Ethics & Political Philosophy</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Logic & Critical Thinking</span>
                  </li>
                </ul>
                <Link href="/departments/philosophy" className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                  Learn more about our Philosophy program
                  <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Theology Department */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
              <div className="relative h-56">
                <Image
                  src="/images/theology-department.jpg"
                  alt="Theology Department"
                  className="object-cover"
                  fill
                />
                <div className="absolute inset-0 bg-indigo-900 bg-opacity-30"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="inline-block bg-white px-3 py-1 rounded-full text-indigo-700 font-semibold text-sm mb-2">Department</span>
                  <h4 className="text-white text-xl font-bold">Theology</h4>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Our Theology department provides comprehensive education in Sacred Scripture, Dogmatics, Moral Theology, and Pastoral Studies, preparing students for ministry and academic careers in theological disciplines.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Biblical Studies & Exegesis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Systematic & Moral Theology</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Liturgy & Pastoral Theology</span>
                  </li>
                </ul>
                <Link href="/departments/theology" className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                  Learn more about our Theology program
                  <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Formation Process */}
          <div className="mt-12 bg-indigo-50 rounded-xl p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-6">The Formation Process</h4>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Human Formation</h5>
                <p className="text-gray-700 text-sm">Development of personal maturity, interpersonal skills, and emotional intelligence</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Spiritual Formation</h5>
                <p className="text-gray-700 text-sm">Cultivation of prayer life, discernment, and spiritual direction</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Intellectual Formation</h5>
                <p className="text-gray-700 text-sm">Rigorous academic studies in philosophy, theology, and related disciplines</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">Pastoral Formation</h5>
                <p className="text-gray-700 text-sm">Practical ministerial experience and development of leadership skills</p>
              </div>
            </div>
          </div>
        </div>

        {/* Committees and Offices */}
        <div>
          <div className="flex items-center mb-10">
            <div className="h-10 w-1 bg-indigo-600 mr-4"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Committees & Offices</h3>
          </div>
          
          <p className="text-lg text-gray-700 mb-8 max-w-4xl">
            Our seminary operates through dedicated committees and offices that ensure excellence in governance, 
            student development, and institutional mission fulfillment.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Academic Affairs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border-t-4 border-indigo-600">
              <div className="p-6">
                <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Academic Affairs</h4>
                <p className="text-gray-700 mb-4">
                  Oversees curriculum development, faculty appointments, academic policies, and research initiatives.
                </p>
                <Link href="/governance/academic-affairs" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                  Learn more
                </Link>
              </div>
            </div>
            
            {/* Spiritual Formation */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border-t-4 border-indigo-600">
              <div className="p-6">
                <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Spiritual Formation</h4>
                <p className="text-gray-700 mb-4">
                  Coordinates liturgical life, retreats, spiritual direction, and personal vocational discernment.
                </p>
                <Link href="/governance/spiritual-formation" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                  Learn more
                </Link>
              </div>
            </div>
            
            {/* Student Affairs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border-t-4 border-indigo-600">
              <div className="p-6">
                <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Student Affairs</h4>
                <p className="text-gray-700 mb-4">
                  Facilitates student life, community activities, counseling services, and housing arrangements.
                </p>
                <Link href="/governance/student-affairs" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                  Learn more
                </Link>
              </div>
            </div>
            
            {/* Pastoral Ministries */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border-t-4 border-indigo-600">
              <div className="p-6">
                <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Pastoral Ministries</h4>
                <p className="text-gray-700 mb-4">
                  Organizes field education, parish placements, and pastoral training opportunities.
                </p>
                <Link href="/governance/pastoral-ministries" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                  Learn more
                </Link>
              </div>
            </div>
            
            {/* Library & Research */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border-t-4 border-indigo-600">
              <div className="p-6">
                <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Library & Research</h4>
                <p className="text-gray-700 mb-4">
                  Maintains extensive theological collections, digital resources, and research assistance.
                </p>
                <Link href="/governance/library-research" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                  Learn more
                </Link>
              </div>
            </div>
            
            {/* Administration */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border-t-4 border-indigo-600">
              <div className="p-6">
                <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Administration</h4>
                <p className="text-gray-700 mb-4">
                  Handles admissions, finances, facilities management, and institutional operations.
                </p>
                <Link href="/governance/administration" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;