// src/app/students/list/page.tsx (UPDATED)
'use client';

import { useState, useMemo } from 'react';
import StudentsLayout from '@/components/Students/StudentsLayout';
import StudentCard from '@/components/Students/StudentCard';
import { useActiveStudents } from '@/hooks/useStudents'; // Changed from useStudents
import { Search, Filter, Grid, List as ListIcon, Users, BookOpen } from 'lucide-react';

const StudentsListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCongregation, setSelectedCongregation] = useState('');
  const [selectedDiocese, setSelectedDiocese] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { students, loading, error } = useActiveStudents({ // Changed to useActiveStudents
    congregation: selectedCongregation || undefined,
    diocese: selectedDiocese || undefined,
  });

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.congregation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.diocese.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  // Get unique congregations and dioceses for filters
  const congregations = useMemo(() => {
    const unique = [...new Set(students.map(s => s.congregation))].sort();
    return unique;
  }, [students]);

  const dioceses = useMemo(() => {
    const unique = [...new Set(students.map(s => s.diocese))].sort();
    return unique;
  }, [students]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCongregation('');
    setSelectedDiocese('');
  };

  if (loading) {
    return (
      <StudentsLayout 
        title="Current Students"
        description="Browse through our active seminary students and their information."
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
        title="Current Students"
        description="Browse through our active seminary students and their information."
      >
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Error loading students: {error}</p>
          </div>
        </div>
      </StudentsLayout>
    );
  }

  return (
    <StudentsLayout 
      title="Current Students"
      description="Browse through our active seminary students and their information."
    >
      <div className="p-6">
        {/* Header with Stats */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-gray-600">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              <span className="font-medium">
                {filteredStudents.length} of {students.length} active students
              </span>
            </div>
            
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Active Seminary Students
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students by name, ID, congregation, or diocese..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            <select
              value={selectedCongregation}
              onChange={(e) => setSelectedCongregation(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Congregations</option>
              {congregations.map(congregation => (
                <option key={congregation} value={congregation}>
                  {congregation}
                </option>
              ))}
            </select>

            <select
              value={selectedDiocese}
              onChange={(e) => setSelectedDiocese(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Dioceses</option>
              {dioceses.map(diocese => (
                <option key={diocese} value={diocese}>
                  {diocese}
                </option>
              ))}
            </select>

            {(searchTerm || selectedCongregation || selectedDiocese) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                Clear filters
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="ml-auto flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Students Grid/List */}
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCongregation || selectedDiocese
                ? 'Try adjusting your search criteria or filters.'
                : 'No active students are currently available.'}
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredStudents.map(student => (
              <StudentCard 
                key={student.id} 
                student={student}
                className={viewMode === 'list' ? 'w-full' : ''}
              />
            ))}
          </div>
        )}
      </div>
    </StudentsLayout>
  );
};

export default StudentsListPage;