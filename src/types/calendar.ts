// src/types/calendar.ts

export interface AcademicYear {
  id: number;
  year: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  is_active: boolean;
  events_count: number;
  is_past: boolean;
  is_future: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventCategory {
  id: number;
  name: string;
  color: string;
  description?: string;
  is_active: boolean;
  events_count: number;
  created_at: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  event_type: 'holiday' | 'exam' | 'registration' | 'semester' | 'orientation' | 
             'graduation' | 'deadline' | 'meeting' | 'conference' | 'workshop' | 'other';
  category: EventCategory;
  academic_year: string | AcademicYear;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  is_all_day: boolean;
  location?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_recurring: boolean;
  recurrence_pattern?: string;
  is_published: boolean;
  is_featured: boolean;
  created_by?: string;
  duration_days: number;
  is_multi_day: boolean;
  is_past: boolean;
  is_current: boolean;
  is_upcoming: boolean;
  formatted_date: string;
  formatted_time?: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarEventListItem {
  id: number;
  title: string;
  event_type: string;
  category: EventCategory;
  academic_year: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  is_all_day: boolean;
  location?: string;
  priority: string;
  is_featured: boolean;
  duration_days: number;
  is_multi_day: boolean;
  is_past: boolean;
  is_current: boolean;
  is_upcoming: boolean;
  formatted_date: string;
}

export interface UpcomingEvent {
  id: number;
  title: string;
  event_type: string;
  category: EventCategory;
  start_date: string;
  end_date?: string;
  is_all_day: boolean;
  start_time?: string;
  priority: string;
  is_featured: boolean;
  days_until: number;
  formatted_date: string;
}

export interface MonthlyCalendarEvent {
  id: number;
  title: string;
  event_type: string;
  start_date: string;
  end_date?: string;
  is_all_day: boolean;
  start_time?: string;
  end_time?: string;
  priority: string;
  is_featured: boolean;
  category_color: string;
  category_name: string;
}

export interface MonthlyCalendarData {
  year: number;
  month: number;
  month_name: string;
  calendar_grid: number[][];
  events: MonthlyCalendarEvent[];
  first_day: string;
  last_day: string;
}

export interface CalendarSettings {
  id: number;
  default_academic_year?: AcademicYear;
  show_weekends: boolean;
  default_view: 'month' | 'week' | 'day' | 'list';
  events_per_page: number;
  allow_public_view: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventStatistics {
  total_events: number;
  past_events: number;
  current_events: number;
  upcoming_events: number;
  featured_events: number;
  events_by_type: Record<string, number>;
  events_by_priority: Record<string, number>;
  events_by_month: Record<string, number>;
}

export interface EventsByCategory {
  category: EventCategory;
  events: CalendarEventListItem[];
}

export interface CalendarFilters {
  academic_year?: number;
  category?: number;
  event_type?: string;
  start_date?: string;
  end_date?: string;
  month?: number;
  year?: number;
  priority?: string;
  time_filter?: 'upcoming' | 'past' | 'current' | 'this_week' | 'this_month' | 'next_month';
  search?: string;
  featured?: boolean;
  order_by?: string;
  page?: number;
  page_size?: number;
}

export interface CalendarEventFormData {
  title: string;
  description?: string;
  event_type: string;
  category: number;
  academic_year: number;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  is_all_day: boolean;
  location?: string;
  priority: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  is_published: boolean;
  is_featured: boolean;
}

export interface ApiResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

export interface SearchResponse {
  query: string;
  count: number;
  results: CalendarEventListItem[];
}

export interface EventsFeedResponse {
  title: string;
  description: string;
  updated: string;
  events: CalendarEventListItem[];
}

// Utility types
export type CalendarView = 'month' | 'week' | 'day' | 'list';
export type EventPriority = 'low' | 'medium' | 'high' | 'urgent';
export type EventType = 'holiday' | 'exam' | 'registration' | 'semester' | 'orientation' | 
                       'graduation' | 'deadline' | 'meeting' | 'conference' | 'workshop' | 'other';
export type TimeFilter = 'upcoming' | 'past' | 'current' | 'this_week' | 'this_month' | 'next_month';

// Component Props Types
export interface CalendarEventCardProps {
  event: CalendarEventListItem;
  showCategory?: boolean;
  showDate?: boolean;
  compact?: boolean;
  onClick?: (event: CalendarEventListItem) => void;
}

export interface CalendarGridProps {
  year: number;
  month: number;
  events: MonthlyCalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: MonthlyCalendarEvent) => void;
}

export interface EventFiltersProps {
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
  academicYears: AcademicYear[];
  categories: EventCategory[];
}

export interface UpcomingEventsWidgetProps {
  limit?: number;
  daysAhead?: number;
  showCategory?: boolean;
  className?: string;
}