// src/app/students/graduates/page.tsx
'use client';

import { useState, useMemo } from 'react';
import StudentsLayout from '@/components/Students/StudentsLayout';
import StudentCard from '@/components/Students/StudentCard';
import { useGraduatedStudents, useCongregationStats } from '@/hooks/useStudents';
import { 
  Search, 
  Filter, 
  Grid, 
  List as ListIcon, 
  GraduationCap, 
  Calendar,
  Download,
  MapPin,
  Users,
  Trophy,
  SortAsc,
  SortDesc
} from 'lucide-react';

const GraduatedStudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCongregation, setSelectedCongregation] = useState('');
  const [selectedDiocese, setSelectedDiocese] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'year_joined' | 'congregation'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { students, loading, error, refetch } = useGraduatedStudents({
    congregation: selectedCongregation || undefined,
    diocese: selectedDiocese || undefined,
    year_joined: selectedYear || undefined,
  });

  const { stats, loading: statsLoading } = useCongregationStats('graduated');

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students;

    // Apply search filter
    if (searchTerm) {
      filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.congregation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.diocese.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort students
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'year_joined':
          aValue = parseInt(a.year_joined);
          bValue = parseInt(b.year_joined);
          break;
        case 'congregation':
          aValue = a.congregation.toLowerCase();
          bValue = b.congregation.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [students, searchTerm, sortBy, sortOrder]);

  // Get unique values for filters
  const congregations = useMemo(() => {
    const unique = [...new Set(students.map(s => s.congregation))].sort();
    return unique;
  }, [students]);

  const dioceses = useMemo(() => {
    const unique = [...new Set(students.map(s => s.diocese))].sort();
    return unique;
  }, [students]);

  const years = useMemo(() => {
    const unique = [...new Set(students.map(s => s.year_joined))].sort().reverse();
    return unique;
  }, [students]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCongregation('');
    setSelectedDiocese('');
    setSelectedYear('');
  };

  const hasActiveFilters = searchTerm || selectedCongregation || selectedDiocese || selectedYear;

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Student ID', 'Congregation', 'Diocese', 'Year Joined', 'Email', 'Phone'].join(','),
      ...filteredAndSortedStudents.map(student => [
        `"${student.name}"`,
        student.student_id,
        `"${student.congregation}"`,
        `"${student.diocese}"`,
        student.year_joined,
        student.email,
        student.phone
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `graduated_students_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || statsLoading) {
    return (
      <StudentsLayout 
        title="Graduated Students"
        description="View our seminary graduates and their achievements."
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
        title="Graduated Students"
        description="View our seminary graduates and their achievements."
      >
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Error loading graduated students: {error}</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </StudentsLayout>
    );
  }

  return (
    <StudentsLayout 
      title="Graduated Students"
      description="View our seminary graduates and their achievements."
    >
      <div className="p-6">
        {/* Header with Stats */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Graduates */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Graduates</p>
                  <p className="text-2xl font-bold">{filteredAndSortedStudents.length}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-green-200" />
              </div>
            </div>

            {/* Congregations */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Congregations</p>
                  <p className="text-2xl font-bold">{stats?.congregations.length || 0}</p>
                </div>
                <MapPin className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            {/* Years Represented */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Years Represented</p>
                  <p className="text-2xl font-bold">{years.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-200" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <Trophy className="w-5 h-5 mr-2" />
              <span className="font-medium">
                {filteredAndSortedStudents.length} of {students.length} graduates shown
              </span>
            </div>
            
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search graduates by name, ID, congregation, or diocese..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters and Controls Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={selectedCongregation}
                onChange={(e) => setSelectedCongregation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Dioceses</option>
                {dioceses.map(diocese => (
                  <option key={diocese} value={diocese}>
                    {diocese}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'year_joined' | 'congregation')}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="name">Name</option>
                  <option value="year_joined">Year Joined</option>
                  <option value="congregation">Congregation</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title="List view"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Graduates Grid/List */}
        {filteredAndSortedStudents.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No graduates found</h3>
            <p className="text-gray-500">
              {hasActiveFilters
                ? 'Try adjusting your search criteria or filters.'
                : 'No graduated students are currently available.'}
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredAndSortedStudents.map(student => (
              <div key={student.id} className="relative">
                <StudentCard 
                  student={student}
                  className={`${viewMode === 'list' ? 'w-full' : ''} border-l-4 border-l-green-500`}
                />
                <div className="absolute top-2 right-2">
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    Graduate
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentsLayout>
  );
};

export default GraduatedStudentsPage;