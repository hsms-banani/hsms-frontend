// src/hooks/useCalendar.ts - FIXED VERSION

import { useState, useEffect, useCallback, useMemo } from 'react';
import { calendarApi, calendarUtils } from '@/lib/calendarApi';
import {
  AcademicYear,
  EventCategory,
  CalendarEvent,
  CalendarEventListItem,
  UpcomingEvent,
  MonthlyCalendarData,
  CalendarSettings,
  EventStatistics,
  CalendarFilters,
  ApiResponse,
} from '@/types/calendar';

// Hook for academic years
export const useAcademicYears = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAcademicYears = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const years = await calendarApi.getAcademicYears();
      setAcademicYears(years);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch academic years');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcademicYears();
  }, [fetchAcademicYears]);

  const currentAcademicYear = useMemo(
    () => calendarUtils.getCurrentAcademicYear(academicYears),
    [academicYears]
  );

  return {
    academicYears,
    currentAcademicYear,
    loading,
    error,
    refetch: fetchAcademicYears,
  };
};

// Hook for event categories
export const useEventCategories = () => {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarApi.getEventCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};

// FIXED: Hook for monthly calendar with proper navigation
export const useMonthlyCalendar = (initialYear?: number, initialMonth?: number) => {
  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(initialYear || currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialMonth || currentDate.getMonth() + 1);
  const [calendarData, setCalendarData] = useState<MonthlyCalendarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendarData = useCallback(async (year: number, month: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarApi.getMonthlyCalendar(year, month);
      setCalendarData(data);
      // Update the current year and month state
      setCurrentYear(year);
      setCurrentMonth(month);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalendarData(currentYear, currentMonth);
  }, []); // Only run on mount

  const goToNextMonth = useCallback(() => {
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    fetchCalendarData(nextYear, nextMonth);
  }, [currentYear, currentMonth, fetchCalendarData]);

  const goToPreviousMonth = useCallback(() => {
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    fetchCalendarData(prevYear, prevMonth);
  }, [currentYear, currentMonth, fetchCalendarData]);

  const goToMonth = useCallback((year: number, month: number) => {
    fetchCalendarData(year, month);
  }, [fetchCalendarData]);

  const goToToday = useCallback(() => {
    const today = new Date();
    fetchCalendarData(today.getFullYear(), today.getMonth() + 1);
  }, [fetchCalendarData]);

  // Helper function to check if navigation is within academic year bounds
  const canNavigate = useCallback((year: number, month: number, academicYears: AcademicYear[]) => {
    if (!academicYears.length) return true;
    
    const currentAcademicYear = academicYears.find(ay => ay.is_current);
    if (!currentAcademicYear) return true;

    const startDate = new Date(currentAcademicYear.start_date);
    const endDate = new Date(currentAcademicYear.end_date);
    const targetDate = new Date(year, month - 1, 1);

    return targetDate >= new Date(startDate.getFullYear(), startDate.getMonth()) && 
           targetDate <= new Date(endDate.getFullYear(), endDate.getMonth());
  }, []);

  return {
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
    refetch: () => fetchCalendarData(currentYear, currentMonth),
  };
};

// Hook for calendar events with filters
export const useCalendarEvents = (initialFilters: CalendarFilters = {}) => {
  const [events, setEvents] = useState<CalendarEventListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CalendarFilters>(initialFilters);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const fetchEvents = useCallback(async (newFilters: CalendarFilters = filters, append = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: ApiResponse<CalendarEventListItem> = await calendarApi.getCalendarEvents(newFilters);
      
      if (append) {
        setEvents(prev => [...prev, ...response.results]);
      } else {
        setEvents(response.results);
      }
      
      setTotalCount(response.count);
      setHasNextPage(!!response.next);
      setHasPreviousPage(!!response.previous);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents(filters);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<CalendarFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchEvents(updatedFilters);
  }, [filters, fetchEvents]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !loading) {
      const nextPageFilters = { ...filters, page: (filters.page || 1) + 1 };
      setFilters(nextPageFilters);
      fetchEvents(nextPageFilters, true);
    }
  }, [filters, hasNextPage, loading, fetchEvents]);

  const refetch = useCallback(() => {
    fetchEvents(filters);
  }, [fetchEvents, filters]);

  // Computed values
  const upcomingEvents = useMemo(
    () => events.filter(event => event.is_upcoming),
    [events]
  );

  const currentEvents = useMemo(
    () => events.filter(event => event.is_current),
    [events]
  );

  const pastEvents = useMemo(
    () => events.filter(event => event.is_past),
    [events]
  );

  const featuredEvents = useMemo(
    () => events.filter(event => event.is_featured),
    [events]
  );

  const eventsByCategory = useMemo(
    () => calendarUtils.groupEventsByCategory(events),
    [events]
  );

  const eventsByDate = useMemo(
    () => calendarUtils.groupEventsByDate(events),
    [events]
  );

  return {
    events,
    totalCount,
    loading,
    error,
    filters,
    hasNextPage,
    hasPreviousPage,
    upcomingEvents,
    currentEvents,
    pastEvents,
    featuredEvents,
    eventsByCategory,
    eventsByDate,
    updateFilters,
    loadMore,
    refetch,
  };
};

// Hook for single calendar event
export const useCalendarEvent = (eventId?: number) => {
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarApi.getCalendarEvent(id);
      setEvent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId);
    }
  }, [eventId, fetchEvent]);

  const refetch = useCallback(() => {
    if (eventId) {
      fetchEvent(eventId);
    }
  }, [eventId, fetchEvent]);

  return {
    event,
    loading,
    error,
    refetch,
  };
};

// Hook for upcoming events
export const useUpcomingEvents = (limit = 5, daysAhead = 30) => {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarApi.getUpcomingEvents(limit, daysAhead);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch upcoming events');
    } finally {
      setLoading(false);
    }
  }, [limit, daysAhead]);

  useEffect(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  return {
    events,
    loading,
    error,
    refetch: fetchUpcomingEvents,
  };
};

// Hook for calendar statistics
export const useCalendarStatistics = (academicYear?: number) => {
  const [statistics, setStatistics] = useState<EventStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarApi.getEventStatistics(academicYear);
      setStatistics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }, [academicYear]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
};

// Hook for calendar settings
export const useCalendarSettings = () => {
  const [settings, setSettings] = useState<CalendarSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarApi.getCalendarSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
  };
};

// Hook for event search
export const useEventSearch = () => {
  const [results, setResults] = useState<CalendarEventListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setQuery(searchQuery);
      const response = await calendarApi.searchEvents(searchQuery);
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults([]);
    setQuery('');
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    query,
    search,
    clearSearch,
  };
};