// src/app/academics/calendar/page.tsx - ENHANCED VERSION WITH FIXES

'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  Grid, 
  List, 
  ChevronDown,
  Flag,
  Clock,
  MapPin,
  Users,
  FileText,
  AlertCircle
} from 'lucide-react';
import { CalendarGrid, EventCard, UpcomingEventsWidget } from '@/components/Calendar/CalendarGrid';
import { useCalendarEvents, useAcademicYears, useEventCategories, useCalendarStatistics } from '@/hooks/useCalendar';
import { CalendarFilters, CalendarView, MonthlyCalendarEvent } from '@/types/calendar';
import { calendarApi, calendarUtils } from '@/lib/calendarApi';

export default function AcademicCalendarPage() {
  // State for view management
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  // Initialize filters
  const [filters, setFilters] = useState<CalendarFilters>({
    page_size: 20,
    order_by: 'start_date',
  });

  // Hooks
  const { academicYears, currentAcademicYear, loading: academicYearsLoading } = useAcademicYears();
  const { categories, loading: categoriesLoading } = useEventCategories();
  const { events, loading, error, totalCount, updateFilters } = useCalendarEvents(filters);
  const { statistics, loading: statsLoading } = useCalendarStatistics(currentAcademicYear?.id);

  // Computed values
  const filteredEvents = useMemo(() => {
    if (!searchQuery) return events;
    return events.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event as any).description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [events, searchQuery]);

  const upcomingEventsCount = useMemo(
    () => events.filter(event => event.is_upcoming).length,
    [events]
  );

  const currentEventsCount = useMemo(
    () => events.filter(event => event.is_current).length,
    [events]
  );

  // Event handlers
  const handleFilterChange = (newFilters: Partial<CalendarFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    updateFilters(updatedFilters);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  // Enhanced export functionality
  const handleExportCalendar = async (format: 'csv' | 'excel' | 'ics' | 'pdf' = 'csv') => {
    try {
      setExportLoading(format);
      
      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'csv':
          blob = await calendarApi.exportToCSV(filters);
          filename = calendarUtils.generateFilename('academic_calendar', 'csv');
          break;
        case 'excel':
          blob = await calendarApi.exportToExcel(filters);
          filename = calendarUtils.generateFilename('academic_calendar', 'xlsx');
          break;
        case 'ics':
          blob = await calendarApi.exportToICS(filters);
          filename = calendarUtils.generateFilename('academic_calendar', 'ics');
          break;
        case 'pdf':
          // For PDF, we'll use browser's print functionality
          window.print();
          return;
        default:
          throw new Error('Unsupported export format');
      }

      calendarUtils.downloadFile(blob, filename);
    } catch (error) {
      console.error(`Export to ${format} failed:`, error);
      alert(`Failed to export calendar to ${format.toUpperCase()}. Please try again.`);
    } finally {
      setExportLoading(null);
    }
  };

  const resetFilters = () => {
    const defaultFilters: CalendarFilters = {
      page_size: 20,
      order_by: 'start_date',
    };
    setFilters(defaultFilters);
    updateFilters(defaultFilters);
    setSearchQuery('');
  };

  // Export all events in current academic year
  const handleExportAcademicYear = async (format: 'csv' | 'excel' | 'ics') => {
    if (!currentAcademicYear) return;
    
    const academicYearFilters = {
      academic_year: currentAcademicYear.id,
      page_size: 1000, // Get all events
    };

    try {
      setExportLoading(format);
      
      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'csv':
          blob = await calendarApi.exportToCSV(academicYearFilters);
          filename = calendarUtils.generateFilename(`academic_calendar_${currentAcademicYear.year}`, 'csv');
          break;
        case 'excel':
          blob = await calendarApi.exportToExcel(academicYearFilters);
          filename = calendarUtils.generateFilename(`academic_calendar_${currentAcademicYear.year}`, 'xlsx');
          break;
        case 'ics':
          blob = await calendarApi.exportToICS(academicYearFilters);
          filename = calendarUtils.generateFilename(`academic_calendar_${currentAcademicYear.year}`, 'ics');
          break;
      }

      calendarUtils.downloadFile(blob, filename);
    } catch (error) {
      console.error(`Export academic year to ${format} failed:`, error);
      alert(`Failed to export academic year to ${format.toUpperCase()}. Please try again.`);
    } finally {
      setExportLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Academic Calendar</h1>
                <p className="mt-2 text-gray-600">
                  {currentAcademicYear ? (
                    <>
                      Academic Year {currentAcademicYear.year}
                      <span className="ml-2 text-sm">
                        ({new Date(currentAcademicYear.start_date).toLocaleDateString()} - {new Date(currentAcademicYear.end_date).toLocaleDateString()})
                      </span>
                    </>
                  ) : 'All Academic Years'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setCurrentView('month')}
                    className={`p-2 rounded-md transition-colors ${
                      currentView === 'month' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Calendar View"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentView('list')}
                    className={`p-2 rounded-md transition-colors ${
                      currentView === 'list' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="List View"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Enhanced Export Button with Dropdown */}
                <div className="relative group">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={exportLoading !== null}
                    title="Export calendar data"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {exportLoading ? `Exporting...` : 'Export'}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Current View
                      </div>
                      <button
                        onClick={() => handleExportCalendar('csv')}
                        disabled={exportLoading !== null}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Export as CSV
                      </button>
                      <button
                        onClick={() => handleExportCalendar('excel')}
                        disabled={exportLoading !== null}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Export as Excel
                      </button>
                      <button
                        onClick={() => handleExportCalendar('ics')}
                        disabled={exportLoading !== null}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Export as iCal
                      </button>
                      <button
                        onClick={() => handleExportCalendar('pdf')}
                        disabled={exportLoading !== null}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Print/PDF
                      </button>
                      
                      {currentAcademicYear && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Full Academic Year
                          </div>
                          <button
                            onClick={() => handleExportAcademicYear('csv')}
                            disabled={exportLoading !== null}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export {currentAcademicYear.year} (CSV)
                          </button>
                          <button
                            onClick={() => handleExportAcademicYear('excel')}
                            disabled={exportLoading !== null}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export {currentAcademicYear.year} (Excel)
                          </button>
                          <button
                            onClick={() => handleExportAcademicYear('ics')}
                            disabled={exportLoading !== null}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export {currentAcademicYear.year} (iCal)
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Stats */}
            {statistics && !statsLoading && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">Total Events</p>
                      <p className="text-2xl font-bold text-blue-900">{statistics.total_events}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">Upcoming</p>
                      <p className="text-2xl font-bold text-green-900">{statistics.upcoming_events}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-yellow-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-600">Current</p>
                      <p className="text-2xl font-bold text-yellow-900">{statistics.current_events}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center">
                    <Flag className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-600">Featured</p>
                      <p className="text-2xl font-bold text-purple-900">{statistics.featured_events}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Academic Year Alert */}
            {!currentAcademicYear && academicYears.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <p className="text-sm text-yellow-800">
                    No current academic year is set. You can view all events across all academic years, but some features may be limited.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors ${
                    showFilters 
                      ? 'border-blue-300 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {/* Quick Filters */}
                <select
                  value={filters.academic_year || ''}
                  onChange={(e) => handleFilterChange({ academic_year: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  disabled={academicYearsLoading}
                >
                  <option value="">All Years</option>
                  {academicYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.year} {year.is_current ? '(Current)' : ''}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.time_filter || ''}
                  onChange={(e) => handleFilterChange({ time_filter: e.target.value as any })}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Time</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="current">Current</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="next_month">Next Month</option>
                </select>

                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange({ category: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={categoriesLoading}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>

                  <select
                    value={filters.event_type || ''}
                    onChange={(e) => handleFilterChange({ event_type: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="holiday">Holiday</option>
                    <option value="exam">Examination</option>
                    <option value="registration">Registration</option>
                    <option value="semester">Semester</option>
                    <option value="orientation">Orientation</option>
                    <option value="graduation">Graduation</option>
                    <option value="deadline">Deadline</option>
                    <option value="meeting">Meeting</option>
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="other">Other</option>
                  </select>

                  <select
                    value={filters.priority || ''}
                    onChange={(e) => handleFilterChange({ priority: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={filters.featured || false}
                      onChange={(e) => handleFilterChange({ featured: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                      Featured Only
                    </label>
                  </div>

                  <select
                    value={filters.order_by || 'start_date'}
                    onChange={(e) => handleFilterChange({ order_by: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="start_date">Date (Ascending)</option>
                    <option value="-start_date">Date (Descending)</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="-title">Title (Z-A)</option>
                    <option value="priority">Priority</option>
                    <option value="-priority">Priority (High to Low)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Calendar/List View */}
          <div className="flex-1">
            {currentView === 'month' ? (
              <CalendarGrid
                onEventClick={handleEventClick}
                className="mb-8"
                filters={filters}
              />
            ) : (
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Events List
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({totalCount} total{searchQuery ? `, ${filteredEvents.length} filtered` : ''})
                      </span>
                    </h2>
                    
                    {filteredEvents.length > 0 && (
                      <button
                        onClick={() => handleExportCalendar('csv')}
                        disabled={exportLoading !== null}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export List
                      </button>
                    )}
                  </div>
                </div>
                
                {loading ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : error ? (
                  <div className="p-6 text-center text-red-600">
                    <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                    <p className="text-lg font-medium mb-2">Error loading events</p>
                    <p className="text-sm">{error}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No events found</h3>
                    <p>
                      {searchQuery 
                        ? `No events match your search "${searchQuery}"`
                        : 'No events found matching your criteria.'
                      }
                    </p>
                    {(searchQuery || Object.keys(filters).some(key => filters[key as keyof CalendarFilters] !== undefined && filters[key as keyof CalendarFilters] !== '')) && (
                      <button
                        onClick={resetFilters}
                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="space-y-4">
                      {filteredEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onClick={() => handleEventClick(event)}
                          showCategory={true}
                          showDate={true}
                        />
                      ))}
                      
                      {searchQuery && filteredEvents.length < totalCount && (
                        <div className="text-center py-4 text-gray-500">
                          <p>Showing {filteredEvents.length} of {totalCount} events matching your search.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Upcoming Events Widget */}
            <UpcomingEventsWidget
              limit={5}
              daysAhead={30}
              showCategory={true}
            />

            {/* Quick Stats */}
            {statistics && !statsLoading && (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Statistics</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">By Type</h4>
                    <div className="space-y-2">
                      {Object.entries(statistics.events_by_type).slice(0, 5).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {calendarUtils.getEventTypeDisplayName(type)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{count}</span>
                            <button
                              onClick={() => handleFilterChange({ event_type: type })}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Filter
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">By Priority</h4>
                    <div className="space-y-2">
                      {Object.entries(statistics.events_by_priority).map(([priority, count]) => (
                        <div key={priority} className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: calendarUtils.getEventPriorityColor(priority) }}
                            ></div>
                            <span className="text-sm text-gray-600 capitalize">{priority}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{count}</span>
                            <button
                              onClick={() => handleFilterChange({ priority })}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Filter
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Categories Legend */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Categories</h3>
              
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors ${
                      filters.category === category.id ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                    onClick={() => handleFilterChange({ 
                      category: filters.category === category.id ? undefined : category.id 
                    })}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {category.events_count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Years */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Years</h3>
              
              <div className="space-y-2">
                {academicYears.map((year) => (
                  <div
                    key={year.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      filters.academic_year === year.id
                        ? 'bg-blue-50 border-blue-200 border'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleFilterChange({ 
                      academic_year: filters.academic_year === year.id ? undefined : year.id 
                    })}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {year.year}
                        </span>
                        {year.is_current && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {year.events_count} events
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {new Date(year.start_date).toLocaleDateString()} - {new Date(year.end_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Export</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleExportCalendar('csv')}
                  disabled={exportLoading !== null}
                  className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export Current View (CSV)
                </button>
                
                {currentAcademicYear && (
                  <button
                    onClick={() => handleExportAcademicYear('ics')}
                    disabled={exportLoading !== null}
                    className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Export Academic Year (iCal)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Event Details</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div
                  className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: selectedEvent.category?.color || '#3B82F6' }}
                ></div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h3>
                    {selectedEvent.is_featured && (
                      <Flag className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{selectedEvent.formatted_date}</span>
                      </div>
                      
                      {selectedEvent.formatted_time && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{selectedEvent.formatted_time}</span>
                        </div>
                      )}
                      
                      {selectedEvent.location && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedEvent.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Category:</span>
                        <span className="ml-2 text-sm text-gray-900">{selectedEvent.category?.name}</span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Type:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {calendarUtils.getEventTypeDisplayName(selectedEvent.event_type)}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Priority:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedEvent.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          selectedEvent.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          selectedEvent.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {selectedEvent.priority}
                        </span>
                      </div>
                      
                      {selectedEvent.duration_days > 1 && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Duration:</span>
                          <span className="ml-2 text-sm text-gray-900">
                            {selectedEvent.duration_days} days
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedEvent.description && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
                      <div className="prose prose-sm max-w-none text-gray-600">
                        {selectedEvent.description.split('\n').map((paragraph: string, index: number) => (
                          <p key={index} className="mb-2">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedEvent.is_recurring && selectedEvent.recurrence_pattern && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-800">Recurring Event</span>
                      </div>
                      <p className="text-sm text-blue-600 mt-1">
                        Pattern: {selectedEvent.recurrence_pattern}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-6 flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Created: {new Date(selectedEvent.created_at).toLocaleDateString()}
                      {selectedEvent.created_by && (
                        <span> by {selectedEvent.created_by}</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {selectedEvent.is_current && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Ongoing
                        </span>
                      )}
                      {selectedEvent.is_upcoming && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          Upcoming
                        </span>
                      )}
                      {selectedEvent.is_past && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                          Past
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}