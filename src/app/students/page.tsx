// src/app/students/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StudentsLayout from '@/components/Students/StudentsLayout';
import { useCongregationStats } from '@/hooks/useStudents';
import { 
  Users, 
  GraduationCap, 
  MapPin, 
  TrendingUp,
  BookOpen,
  Award,
  ArrowRight,
  Calendar,
  Globe
} from 'lucide-react';

const StudentsOverviewPage = () => {
  const { stats: activeStats, loading: activeLoading } = useCongregationStats('active');
  const { stats: graduatedStats, loading: graduatedLoading } = useCongregationStats('graduated');
  const { stats: allStats, loading: allLoading } = useCongregationStats('all');

  if (activeLoading || graduatedLoading || allLoading) {
    return (
      <StudentsLayout 
        title="Student Overview"
        description="Comprehensive view of our seminary community."
      >
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </StudentsLayout>
    );
  }

  return (
    <StudentsLayout 
      title="Student Overview"
      description="Comprehensive view of our seminary community."
    >
      <div className="p-6">
        {/* Main Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Students */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-blue-200" />
              <span className="text-blue-100 text-sm font-medium">Active</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{activeStats?.total_students || 0}</p>
              <p className="text-blue-100 text-sm">Current Students</p>
            </div>
          </div>

          {/* Graduates */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <GraduationCap className="w-8 h-8 text-green-200" />
              <span className="text-green-100 text-sm font-medium">Graduated</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{graduatedStats?.total_students || 0}</p>
              <p className="text-green-100 text-sm">Seminary Graduates</p>
            </div>
          </div>

          {/* Total Congregations */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <MapPin className="w-8 h-8 text-purple-200" />
              <span className="text-purple-100 text-sm font-medium">Reach</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{allStats?.congregations.length || 0}</p>
              <p className="text-purple-100 text-sm">Congregations</p>
            </div>
          </div>

          {/* Total Dioceses */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Globe className="w-8 h-8 text-orange-200" />
              <span className="text-orange-100 text-sm font-medium">Coverage</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{allStats?.dioceses.length || 0}</p>
              <p className="text-orange-100 text-sm">Dioceses</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Current Students Card */}
          <Link href="/students/list">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Current Students</h3>
                    <p className="text-gray-600 text-sm">View active seminary students</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {activeStats?.total_students || 0}
              </div>
              <p className="text-gray-500 text-sm">
                Active students from {activeStats?.congregations.length || 0} congregations
              </p>
            </div>
          </Link>

          {/* Graduated Students Card */}
          <Link href="/students/graduates">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Graduated Students</h3>
                    <p className="text-gray-600 text-sm">View seminary graduates</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {graduatedStats?.total_students || 0}
              </div>
              <p className="text-gray-500 text-sm">
                Graduates from {graduatedStats?.congregations.length || 0} congregations
              </p>
            </div>
          </Link>
        </div>

        {/* Geographic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Congregations */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Top Congregations (All Students)
            </h3>
            <div className="space-y-3">
              {allStats?.congregations
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map((congregation, index) => (
                  <div key={congregation.congregation} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-900 font-medium">{congregation.congregation}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(congregation.count / (allStats?.total_students || 1)) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-gray-600 text-sm w-8">{congregation.count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Dioceses */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-purple-600" />
              Top Dioceses (All Students)
            </h3>
            <div className="space-y-3">
              {allStats?.dioceses
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map((diocese, index) => (
                  <div key={diocese.diocese} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-900 font-medium">{diocese.diocese}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(diocese.count / (allStats?.total_students || 1)) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-gray-600 text-sm w-8">{diocese.count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/students/congregations" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <MapPin className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Geographic Distribution</div>
                <div className="text-sm text-gray-600">View detailed breakdown</div>
              </div>
            </Link>
            
            <Link href="/students/enrollment" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <Calendar className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Enrollment Info</div>
                <div className="text-sm text-gray-600">Requirements & process</div>
              </div>
            </Link>
            
            <Link href="/students/faqs" className="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <Award className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">FAQs & Support</div>
                <div className="text-sm text-gray-600">Get help & answers</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </StudentsLayout>
  );
};

export default StudentsOverviewPage;