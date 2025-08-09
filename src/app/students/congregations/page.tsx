// src/app/students/congregations/page.tsx
'use client';

import StudentsLayout from '@/components/Students/StudentsLayout';
import { useCongregationStats } from '@/hooks/useStudents';
import { MapPin, Users, BarChart3 } from 'lucide-react';

const CongregationsPage = () => {
  const { stats, loading, error } = useCongregationStats();

  if (loading) {
    return (
      <StudentsLayout 
        title="Congregations & Diocesan Representation"
        description="Geographic distribution of our seminary students across congregations and dioceses."
      >
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </StudentsLayout>
    );
  }

  if (error) {
    return (
      <StudentsLayout 
        title="Congregations & Diocesan Representation"
        description="Geographic distribution of our seminary students across congregations and dioceses."
      >
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Error loading statistics: {error}</p>
          </div>
        </div>
      </StudentsLayout>
    );
  }

  if (!stats) {
    return (
      <StudentsLayout 
        title="Congregations & Diocesan Representation"
        description="Geographic distribution of our seminary students across congregations and dioceses."
      >
        <div className="p-8">
          <div className="text-center py-12">
            <p className="text-gray-500">No statistics available.</p>
          </div>
        </div>
      </StudentsLayout>
    );
  }

  return (
    <StudentsLayout 
      title="Congregations & Diocesan Representation"
      description="Geographic distribution of our seminary students across congregations and dioceses."
    >
      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-blue-900">{stats.total_students}</h3>
                <p className="text-sm text-blue-700">Total Students</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-green-900">{stats.congregations.length}</h3>
                <p className="text-sm text-green-700">Congregations</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-purple-900">{stats.dioceses.length}</h3>
                <p className="text-sm text-purple-700">Dioceses</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Congregations */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Congregations</h2>
            </div>
            
            <div className="space-y-3">
              {stats.congregations.map((congregation, index) => {
                const percentage = (congregation.count / stats.total_students) * 100;
                
                return (
                  <div key={congregation.congregation} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{congregation.congregation}</h3>
                      <div className="mt-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="font-semibold text-gray-900">{congregation.count}</div>
                      <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dioceses */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Dioceses</h2>
            </div>
            
            <div className="space-y-3">
              {stats.dioceses.map((diocese, index) => {
                const percentage = (diocese.count / stats.total_students) * 100;
                
                return (
                  <div key={diocese.diocese} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{diocese.diocese}</h3>
                      <div className="mt-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="font-semibold text-gray-900">{diocese.count}</div>
                      <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Geographic Diversity Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <MapPin className="w-6 h-6 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Geographic Diversity</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Our seminary welcomes students from {stats.congregations.length} different congregations 
                across {stats.dioceses.length} dioceses, representing the rich diversity of our faith community. 
                This geographic representation ensures that future ministers understand and can serve 
                communities from various cultural and regional backgrounds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StudentsLayout>
  );
};

export default CongregationsPage;