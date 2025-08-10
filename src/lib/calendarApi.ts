// src/lib/calendarApi.ts - ENHANCED VERSION WITH EXPORT

import {
  AcademicYear,
  EventCategory,
  CalendarEvent,
  CalendarEventListItem,
  UpcomingEvent,
  MonthlyCalendarData,
  CalendarSettings,
  EventStatistics,
  EventsByCategory,
  CalendarFilters,
  CalendarEventFormData,
  ApiResponse,
  SearchResponse,
  EventsFeedResponse,
} from '@/types/calendar';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.hsms-banani.org';

class CalendarApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}/api/academics${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Academic Years
  async getAcademicYears(): Promise<AcademicYear[]> {
    return this.fetchApi<AcademicYear[]>('/calendar/academic-years/');
  }

  async getAcademicYear(id: number): Promise<AcademicYear> {
    return this.fetchApi<AcademicYear>(`/calendar/academic-years/${id}/`);
  }

  // Event Categories
  async getEventCategories(): Promise<EventCategory[]> {
    return this.fetchApi<EventCategory[]>('/calendar/categories/');
  }

  // Calendar Events - List with filters
  async getCalendarEvents(filters: CalendarFilters = {}): Promise<ApiResponse<CalendarEventListItem>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const endpoint = `/calendar/events/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.fetchApi<ApiResponse<CalendarEventListItem>>(endpoint);
  }

  // Single Event
  async getCalendarEvent(id: number): Promise<CalendarEvent> {
    return this.fetchApi<CalendarEvent>(`/calendar/events/${id}/`);
  }

  // Create Event
  async createCalendarEvent(eventData: CalendarEventFormData): Promise<CalendarEvent> {
    return this.fetchApi<CalendarEvent>('/calendar/events/create/', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Update Event
  async updateCalendarEvent(id: number, eventData: Partial<CalendarEventFormData>): Promise<CalendarEvent> {
    return this.fetchApi<CalendarEvent>(`/calendar/events/${id}/update/`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  // Delete Event
  async deleteCalendarEvent(id: number): Promise<void> {
    return this.fetchApi<void>(`/calendar/events/${id}/delete/`, {
      method: 'DELETE',
    });
  }

  // Upcoming Events
  async getUpcomingEvents(limit: number = 5, daysAhead: number = 30): Promise<UpcomingEvent[]> {
    const queryParams = new URLSearchParams({
      limit: String(limit),
      days_ahead: String(daysAhead),
    });
    
    return this.fetchApi<UpcomingEvent[]>(`/calendar/upcoming/?${queryParams.toString()}`);
  }

  // Current Events
  async getCurrentEvents(): Promise<CalendarEventListItem[]> {
    return this.fetchApi<CalendarEventListItem[]>('/calendar/current/');
  }

  // Monthly Calendar
  async getMonthlyCalendar(year: number, month: number): Promise<MonthlyCalendarData> {
    return this.fetchApi<MonthlyCalendarData>(`/calendar/month/${year}/${month}/`);
  }

  // Events by Category
  async getEventsByCategory(academicYear?: number): Promise<EventsByCategory[]> {
    const endpoint = `/calendar/by-category/${academicYear ? '?academic_year=' + academicYear : ''}`;
    return this.fetchApi<EventsByCategory[]>(endpoint);
  }

  // Event Statistics
  async getEventStatistics(academicYear?: number): Promise<EventStatistics> {
    const endpoint = `/calendar/statistics/${academicYear ? '?academic_year=' + academicYear : ''}`;
    return this.fetchApi<EventStatistics>(endpoint);
  }

  // Calendar Settings
  async getCalendarSettings(): Promise<CalendarSettings> {
    return this.fetchApi<CalendarSettings>('/calendar/settings/');
  }

  // Search Events
  async searchEvents(query: string): Promise<SearchResponse> {
    const queryParams = new URLSearchParams({ q: query });
    return this.fetchApi<SearchResponse>(`/calendar/search/?${queryParams.toString()}`);
  }

  // Events Feed
  async getEventsFeed(format: 'json' | 'ical' = 'json', limit: number = 50): Promise<EventsFeedResponse> {
    const queryParams = new URLSearchParams({
      format,
      limit: String(limit),
    });
    
    return this.fetchApi<EventsFeedResponse>(`/calendar/feed/?${queryParams.toString()}`);
  }

  // EXPORT FUNCTIONS - NEW

  // Export to CSV
  async exportToCSV(filters: CalendarFilters = {}): Promise<Blob> {
    try {
      const events = await this.getCalendarEvents(filters);
      const csvContent = this.generateCSV(events.results);
      return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    } catch (error) {
      console.error('Export to CSV failed:', error);
      throw error;
    }
  }

  // Export to Excel (XLSX)
  async exportToExcel(filters: CalendarFilters = {}): Promise<Blob> {
    try {
      const events = await this.getCalendarEvents(filters);
      
      // Create a simple Excel-compatible CSV with UTF-8 BOM
      const csvContent = '\ufeff' + this.generateCSV(events.results);
      return new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    } catch (error) {
      console.error('Export to Excel failed:', error);
      throw error;
    }
  }

  // Export to iCal/ICS format
  async exportToICS(filters: CalendarFilters = {}): Promise<Blob> {
    try {
      const events = await this.getCalendarEvents(filters);
      const icsContent = this.generateICS(events.results);
      return new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    } catch (error) {
      console.error('Export to ICS failed:', error);
      throw error;
    }
  }

  // Export to PDF (JSON data for PDF generation)
  async exportToPDF(filters: CalendarFilters = {}): Promise<CalendarEventListItem[]> {
    try {
      const events = await this.getCalendarEvents(filters);
      return events.results;
    } catch (error) {
      console.error('Export to PDF failed:', error);
      throw error;
    }
  }

  // Helper function to generate CSV content
  private generateCSV(events: CalendarEventListItem[]): string {
    const headers = [
      'Title',
      'Description',
      'Event Type',
      'Category',
      'Start Date',
      'End Date',
      'Start Time',
      'End Time',
      'All Day',
      'Location',
      'Priority',
      'Academic Year',
      'Featured',
      'Status'
    ];

    const csvRows = [
      headers.join(','),
      ...events.map(event => [
        `"${(event.title || '').replace(/"/g, '""')}"`,
        `"${((event as any).description || '').replace(/"/g, '""')}"`,
        `"${calendarUtils.getEventTypeDisplayName(event.event_type)}"`,
        `"${event.category.name}"`,
        `"${event.start_date}"`,
        `"${event.end_date || ''}"`,
        `"${event.start_time || ''}"`,
        `"${event.end_time || ''}"`,
        `"${event.is_all_day ? 'Yes' : 'No'}"`,
        `"${(event.location || '').replace(/"/g, '""')}"`,
        `"${event.priority}"`,
        `"${event.academic_year}"`,
        `"${event.is_featured ? 'Yes' : 'No'}"`,
        `"${event.is_current ? 'Current' : event.is_upcoming ? 'Upcoming' : 'Past'}"`
      ].join(','))
    ];

    return csvRows.join('\n');
  }

  // Helper function to generate ICS content
  private generateICS(events: CalendarEventListItem[]): string {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Academic Calendar//Academic Events//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Academic Calendar',
      'X-WR-TIMEZONE:UTC'
    ].join('\r\n');

    events.forEach(event => {
      const startDate = new Date(event.start_date + (event.start_time ? `T${event.start_time}` : 'T00:00:00'));
      const endDate = event.end_date ? 
        new Date(event.end_date + (event.end_time ? `T${event.end_time}` : 'T23:59:59')) : 
        new Date(startDate.getTime() + (event.is_all_day ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000));

      const formatDate = (date: Date, allDay: boolean) => {
        if (allDay) {
          return date.toISOString().split('T')[0].replace(/-/g, '');
        }
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      icsContent += '\r\n' + [
        'BEGIN:VEVENT',
        `UID:${event.id}@academic-calendar`,
        `DTSTAMP:${timestamp}`,
        `DTSTART${event.is_all_day ? ';VALUE=DATE' : ''}:${formatDate(startDate, event.is_all_day)}`,
        `DTEND${event.is_all_day ? ';VALUE=DATE' : ''}:${formatDate(endDate, event.is_all_day)}`,
        `SUMMARY:${event.title.replace(/[,;\\]/g, '\\$&')}`,
        ...(event.location ? [`LOCATION:${event.location.replace(/[,;\\]/g, '\\$&')}`] : []),
        ...(((event as any).description) ? [`DESCRIPTION:${((event as any).description).replace(/[,;\\]/g, '\\$&')}`] : []),
        `CATEGORIES:${event.category.name}`,
        `PRIORITY:${event.priority === 'urgent' ? '1' : event.priority === 'high' ? '3' : event.priority === 'medium' ? '5' : '7'}`,
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE',
        'END:VEVENT'
      ].join('\r\n');
    });

    icsContent += '\r\nEND:VCALENDAR';
    return icsContent;
  }

  // Utility methods

  // Get events for current academic year
  async getCurrentAcademicYearEvents(): Promise<CalendarEventListItem[]> {
    const academicYears = await this.getAcademicYears();
    const currentYear = academicYears.find(year => year.is_current);
    
    if (currentYear) {
      const response = await this.getCalendarEvents({ academic_year: currentYear.id });
      return response.results;
    }
    
    return [];
  }

  // Get featured events
  async getFeaturedEvents(limit?: number): Promise<CalendarEventListItem[]> {
    const filters: CalendarFilters = { featured: true };
    if (limit) filters.page_size = limit;
    
    const response = await this.getCalendarEvents(filters);
    return response.results;
  }

  // Get events by type
  async getEventsByType(eventType: string, limit?: number): Promise<CalendarEventListItem[]> {
    const filters: CalendarFilters = { event_type: eventType };
    if (limit) filters.page_size = limit;
    
    const response = await this.getCalendarEvents(filters);
    return response.results;
  }

  // Get events for date range
  async getEventsInDateRange(startDate: string, endDate: string): Promise<CalendarEventListItem[]> {
    const response = await this.getCalendarEvents({
      start_date: startDate,
      end_date: endDate,
    });
    return response.results;
  }

  // Get events for current week
  async getCurrentWeekEvents(): Promise<CalendarEventListItem[]> {
    const response = await this.getCalendarEvents({
      time_filter: 'this_week',
    });
    return response.results;
  }

  // Get events for current month
  async getCurrentMonthEvents(): Promise<CalendarEventListItem[]> {
    const response = await this.getCalendarEvents({
      time_filter: 'this_month',
    });
    return response.results;
  }

  // Get events for next month
  async getNextMonthEvents(): Promise<CalendarEventListItem[]> {
    const response = await this.getCalendarEvents({
      time_filter: 'next_month',
    });
    return response.results;
  }

  // Get high priority events
  async getHighPriorityEvents(limit?: number): Promise<CalendarEventListItem[]> {
    const filters: CalendarFilters = { priority: 'high' };
    if (limit) filters.page_size = limit;
    
    const response = await this.getCalendarEvents(filters);
    return response.results;
  }

  // Get events by location
  async getEventsByLocation(location: string): Promise<CalendarEventListItem[]> {
    const response = await this.getCalendarEvents({
      search: location,
    });
    return response.results.filter(event => 
      event.location?.toLowerCase().includes(location.toLowerCase())
    );
  }
}

// Create and export a singleton instance
export const calendarApi = new CalendarApiService();

// Export utility functions for common operations
export const calendarUtils = {
  // Format date for API
  formatDateForApi: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  // Format time for API
  formatTimeForApi: (date: Date): string => {
    return date.toTimeString().split(' ')[0].slice(0, 5);
  },

  // Parse API date
  parseApiDate: (dateString: string): Date => {
    return new Date(dateString);
  },

  // Get current academic year from list
  getCurrentAcademicYear: (academicYears: AcademicYear[]): AcademicYear | null => {
    return academicYears.find(year => year.is_current) || null;
  },

  // Check if event is happening today
  isEventToday: (event: CalendarEventListItem): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return event.start_date <= today && (event.end_date || event.start_date) >= today;
  },

  // Get days until event
  getDaysUntilEvent: (event: CalendarEventListItem): number => {
    const today = new Date();
    const eventDate = new Date(event.start_date);
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Group events by date
  groupEventsByDate: (events: CalendarEventListItem[]): Record<string, CalendarEventListItem[]> => {
    return events.reduce((groups, event) => {
      const date = event.start_date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    }, {} as Record<string, CalendarEventListItem[]>);
  },

  // Group events by category
  groupEventsByCategory: (events: CalendarEventListItem[]): Record<string, CalendarEventListItem[]> => {
    return events.reduce((groups, event) => {
      const categoryName = event.category.name;
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(event);
      return groups;
    }, {} as Record<string, CalendarEventListItem[]>);
  },

  // Sort events by date and time
  sortEventsByDateTime: (events: CalendarEventListItem[]): CalendarEventListItem[] => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.start_date + (a.start_time ? `T${a.start_time}` : ''));
      const dateB = new Date(b.start_date + (b.start_time ? `T${b.start_time}` : ''));
      return dateA.getTime() - dateB.getTime();
    });
  },

  // Filter events by priority
  filterEventsByPriority: (events: CalendarEventListItem[], priority: string): CalendarEventListItem[] => {
    return events.filter(event => event.priority === priority);
  },

  // Get event color based on priority
  getEventPriorityColor: (priority: string): string => {
    const colors = {
      low: '#10B981',      // green
      medium: '#F59E0B',   // yellow
      high: '#EF4444',     // red
      urgent: '#DC2626',   // dark red
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  },

  // Get event type display name
  getEventTypeDisplayName: (eventType: string): string => {
    const displayNames = {
      holiday: 'Holiday',
      exam: 'Examination',
      registration: 'Registration',
      semester: 'Semester',
      orientation: 'Orientation',
      graduation: 'Graduation',
      deadline: 'Deadline',
      meeting: 'Meeting',
      conference: 'Conference',
      workshop: 'Workshop',
      other: 'Other',
    };
    return displayNames[eventType as keyof typeof displayNames] || 'Other';
  },

  // Validate event form data
  validateEventFormData: (data: CalendarEventFormData): string[] => {
    const errors: string[] = [];

    if (!data.title?.trim()) {
      errors.push('Title is required');
    }

    if (!data.start_date) {
      errors.push('Start date is required');
    }

    if (data.end_date && data.start_date && data.end_date < data.start_date) {
      errors.push('End date must be after start date');
    }

    if (!data.is_all_day && data.start_time && data.end_time) {
      const startTime = new Date(`2000-01-01T${data.start_time}`);
      const endTime = new Date(`2000-01-01T${data.end_time}`);
      
      if (data.start_date === data.end_date && startTime >= endTime) {
        errors.push('End time must be after start time for same-day events');
      }
    }

    if (!data.category) {
      errors.push('Category is required');
    }

    if (!data.academic_year) {
      errors.push('Academic year is required');
    }

    return errors;
  },

  // Export helper functions
  downloadFile: (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Generate filename with current date
  generateFilename: (baseName: string, extension: string): string => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    return `${baseName}_${dateStr}.${extension}`;
  },

  // Check if date is within academic year
  isDateInAcademicYear: (date: Date, academicYear: AcademicYear): boolean => {
    const startDate = new Date(academicYear.start_date);
    const endDate = new Date(academicYear.end_date);
    return date >= startDate && date <= endDate;
  },

  // Get academic year months
  getAcademicYearMonths: (academicYear: AcademicYear): Array<{year: number, month: number, name: string}> => {
    const months = [];
    const start = new Date(academicYear.start_date);
    const end = new Date(academicYear.end_date);
    
    const current = new Date(start.getFullYear(), start.getMonth(), 1);
    
    while (current <= end) {
      months.push({
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        name: current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  },
};

// Export default
export default calendarApi;