// src/components/Calendar/CalendarGrid.tsx - ENHANCED VERSION WITH FIXED NAVIGATION

'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Flag, Download, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { useMonthlyCalendar, useUpcomingEvents, useAcademicYears } from '@/hooks/useCalendar';
import { MonthlyCalendarEvent, CalendarFilters } from '@/types/calendar';
import { calendarApi, calendarUtils } from '@/lib/calendarApi';

interface CalendarGridProps {
  year?: number;
  month?: number;
  onEventClick?: (event: MonthlyCalendarEvent) => void;
  className?: string;
  filters?: CalendarFilters;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  month,
  onEventClick,
  className = '',
  filters = {},
}) => {
  const { academicYears, currentAcademicYear } = useAcademicYears();
  const {
    calendarData,
    loading,
    error,
    currentYear,
    currentMonth,
    goToNextMonth,
    goToPreviousMonth,
    goToMonth,
    goToToday,
    canNavigate,
  } = useMonthlyCalendar(year, month);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  const today = new Date();
  const todayString = calendarUtils.formatDateForApi(today);

  // Check if we can navigate to next/previous month within academic year bounds
  const canNavigateNext = currentAcademicYear ? 
    canNavigate(
      currentMonth === 12 ? currentYear + 1 : currentYear,
      currentMonth === 12 ? 1 : currentMonth + 1,
      academicYears
    ) : true;

  const canNavigatePrev = currentAcademicYear ? 
    canNavigate(
      currentMonth === 1 ? currentYear - 1 : currentYear,
      currentMonth === 1 ? 12 : currentMonth - 1,
      academicYears
    ) : true;

  const getDayEvents = (day: number): MonthlyCalendarEvent[] => {
    if (!calendarData || day === 0) return [];
    
    const dateString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return calendarData.events.filter(event => {
      const eventStart = event.start_date;
      const eventEnd = event.end_date || event.start_date;
      return dateString >= eventStart && dateString <= eventEnd;
    });
  };

  const handleDateClick = (day: number) => {
    if (day === 0) return;
    
    const dateString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(selectedDate === dateString ? null : dateString);
  };

  const isToday = (day: number): boolean => {
    if (day === 0) return false;
    const dateString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateString === todayString;
  };

  const isPastDate = (day: number): boolean => {
    if (day === 0) return false;
    const dateString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateString < todayString;
  };

  const isOutsideAcademicYear = (day: number): boolean => {
    if (day === 0 || !currentAcademicYear) return false;
    
    const dateString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const date = new Date(dateString);
    
    return !calendarUtils.isDateInAcademicYear(date, currentAcademicYear);
  };

  // Export functions
  const handleExport = async (format: 'csv' | 'excel' | 'ics' | 'pdf') => {
    try {
      setExportLoading(format);
      
      const exportFilters = {
        ...filters,
        year: currentYear,
        month: currentMonth,
      };

      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'csv':
          blob = await calendarApi.exportToCSV(exportFilters);
          filename = calendarUtils.generateFilename(`calendar_${currentYear}_${currentMonth}`, 'csv');
          break;
        case 'excel':
          blob = await calendarApi.exportToExcel(exportFilters);
          filename = calendarUtils.generateFilename(`calendar_${currentYear}_${currentMonth}`, 'xlsx');
          break;
        case 'ics':
          blob = await calendarApi.exportToICS(exportFilters);
          filename = calendarUtils.generateFilename(`calendar_${currentYear}_${currentMonth}`, 'ics');
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

  // Quick navigation to specific months within academic year
  const getAcademicYearMonths = () => {
    if (!currentAcademicYear) return [];
    return calendarUtils.getAcademicYearMonths(currentAcademicYear);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center text-red-600">
          <Calendar className="mx-auto h-12 w-12 mb-2" />
          <p>Error loading calendar: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!calendarData) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Calendar className="mx-auto h-12 w-12 mb-2" />
          <p>No calendar data available</p>
        </div>
      </div>
    );
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {calendarData.month_name} {currentYear}
          </h2>
          {currentAcademicYear && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {currentAcademicYear.year}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Export Dropdown */}
          <div className="relative group">
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={exportLoading !== null}
            >
              <Download className="h-4 w-4 mr-2" />
              {exportLoading ? 'Exporting...' : 'Export'}
              <ChevronRight className="h-3 w-3 ml-1 rotate-90" />
            </button>
            
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => handleExport('csv')}
                  disabled={exportLoading !== null}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  disabled={exportLoading !== null}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export as Excel
                </button>
                <button
                  onClick={() => handleExport('ics')}
                  disabled={exportLoading !== null}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Export as iCal
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={exportLoading !== null}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Print/PDF
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={goToPreviousMonth}
              disabled={!canNavigatePrev}
              className={`p-2 rounded-md transition-colors ${
                canNavigatePrev 
                  ? 'hover:bg-gray-100 text-gray-600' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Previous month"
              title={!canNavigatePrev ? 'Outside academic year range' : 'Previous month'}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
            >
              Today
            </button>

            <button
              onClick={goToNextMonth}
              disabled={!canNavigateNext}
              className={`p-2 rounded-md transition-colors ${
                canNavigateNext 
                  ? 'hover:bg-gray-100 text-gray-600' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Next month"
              title={!canNavigateNext ? 'Outside academic year range' : 'Next month'}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Month Navigation */}
          {currentAcademicYear && (
            <select
              value={`${currentYear}-${currentMonth}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-').map(Number);
                goToMonth(year, month);
              }}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {getAcademicYearMonths().map(({ year, month, name }) => (
                <option key={`${year}-${month}`} value={`${year}-${month}`}>
                  {name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Academic Year Info */}
      {currentAcademicYear && (
        <div className="px-4 py-2 bg-blue-50 border-b">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700">
              Academic Year: {currentAcademicYear.year}
            </span>
            <span className="text-blue-600">
              {new Date(currentAcademicYear.start_date).toLocaleDateString()} - {new Date(currentAcademicYear.end_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-500 border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarData.calendar_grid.flat().map((day, index) => {
          const dayEvents = getDayEvents(day);
          const isSelectedDate = day !== 0 && selectedDate === `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isOutside = isOutsideAcademicYear(day);
          
          return (
            <div
              key={index}
              className={`min-h-24 border-r border-b last:border-r-0 p-1 ${
                day === 0 
                  ? 'bg-gray-50' 
                  : isOutside
                  ? 'bg-red-50'
                  : isToday(day)
                  ? 'bg-blue-50'
                  : isPastDate(day)
                  ? 'bg-gray-50'
                  : 'bg-white hover:bg-gray-50'
              } ${day !== 0 && !isOutside ? 'cursor-pointer' : ''} ${isSelectedDate ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => !isOutside && handleDateClick(day)}
              title={isOutside ? 'Outside academic year' : ''}
            >
              {day !== 0 && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isOutside 
                      ? 'text-red-400' 
                      : isToday(day) 
                      ? 'text-blue-600' 
                      : isPastDate(day) 
                      ? 'text-gray-400' 
                      : 'text-gray-900'
                  }`}>
                    {day}
                    {isOutside && (
                      <span className="ml-1 text-xs">⚠</span>
                    )}
                  </div>
                  
                  {/* Events */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event, eventIndex) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                        className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: event.category_color + '20', color: event.category_color }}
                        title={`${event.title}${event.location ? ` - ${event.location}` : ''}`}
                      >
                        <div className="flex items-center space-x-1">
                          {event.is_featured && <Flag className="h-2 w-2 flex-shrink-0" />}
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    ))}
                    
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 px-1 cursor-pointer hover:text-gray-700"
                           onClick={() => handleDateClick(day)}>
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="border-t p-4 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-3">
            Events for {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          
          {getDayEvents(parseInt(selectedDate.split('-')[2])).length === 0 ? (
            <p className="text-gray-500 text-sm">No events scheduled for this date.</p>
          ) : (
            <div className="space-y-2">
              {getDayEvents(parseInt(selectedDate.split('-')[2])).map((event) => (
                <div
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className="p-3 bg-white rounded-md border cursor-pointer hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: event.category_color }}
                        ></div>
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        {event.is_featured && (
                          <Flag className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        {!event.is_all_day && event.start_time && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {event.start_time}
                              {event.end_time && ` - ${event.end_time}`}
                            </span>
                          </div>
                        )}
                        
                        {event.is_all_day && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>All Day</span>
                          </div>
                        )}

                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-1 text-xs text-gray-400">
                        {event.category_name} • {calendarUtils.getEventTypeDisplayName(event.event_type)}
                      </div>
                    </div>
                    
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      event.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {event.priority}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// EventCard Component
interface EventCardProps {
  event: any; // Use appropriate type based on your event structure
  onClick?: () => void;
  showCategory?: boolean;
  showDate?: boolean;
  compact?: boolean;
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onClick,
  showCategory = true,
  showDate = true,
  compact = false,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        compact ? 'p-3' : 'p-4'
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {showCategory && (
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: event.category?.color || '#3B82F6' }}
              ></div>
            )}
            <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
              {event.title}
            </h3>
            {event.is_featured && (
              <Flag className={`text-yellow-500 ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
            )}
          </div>
          
          {showDate && (
            <div className={`mt-1 flex items-center space-x-4 text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>
              <div className="flex items-center space-x-1">
                <Calendar className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
                <span>{event.formatted_date}</span>
              </div>
              
              {!event.is_all_day && event.start_time && (
                <div className="flex items-center space-x-1">
                  <Clock className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
                  <span>{event.formatted_time || event.start_time}</span>
                </div>
              )}
            </div>
          )}
          
          {event.location && (
            <div className={`mt-1 flex items-center space-x-1 text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>
              <MapPin className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
              <span>{event.location}</span>
            </div>
          )}
          
          {!compact && event.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {event.description}
            </p>
          )}
          
          <div className={`mt-2 flex items-center justify-between ${compact ? 'text-xs' : 'text-sm'}`}>
            {showCategory && event.category && (
              <span className="text-gray-500">{event.category.name}</span>
            )}
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                event.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                event.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {event.priority}
              </span>
              
              {event.is_current && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  Ongoing
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// UpcomingEventsWidget Component
interface UpcomingEventsWidgetProps {
  limit?: number;
  daysAhead?: number;
  showCategory?: boolean;
  className?: string;
}

export const UpcomingEventsWidget: React.FC<UpcomingEventsWidgetProps> = ({
  limit = 5,
  daysAhead = 30,
  showCategory = true,
  className = '',
}) => {
  const { events, loading, error } = useUpcomingEvents(limit, daysAhead);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm p-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm p-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="text-center text-red-600">
          <p>Error loading events: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border shadow-sm p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
      
      {events.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          <Calendar className="mx-auto h-8 w-8 mb-2" />
          <p>No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              {showCategory && (
                <div
                  className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: event.category.color }}
                ></div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                  {event.days_until <= 3 && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {event.days_until === 0 ? 'Today' : `${event.days_until}d`}
                    </span>
                  )}
                </div>
                
                <div className="mt-1 flex items-center space-x-3 text-xs text-gray-500">
                  <span>{event.formatted_date}</span>
                  {!event.is_all_day && event.start_time && (
                    <span>{event.start_time}</span>
                  )}
                  {showCategory && (
                    <span>{event.category.name}</span>
                  )}
                </div>
                
                {event.is_featured && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      <Flag className="h-3 w-3 mr-1" />
                      Featured
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;