// types/announcements.ts
export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: number;
  created_at: string;
  updated_at: string;
  start_date: string;
  end_date: string | null;
  attachment?: string;
  attachment_url?: string;
  attachment_name?: string;
  attachment_size?: string;
  attachment_type?: 'image' | 'pdf' | 'document' | 'spreadsheet' | 'presentation' | 'archive' | 'media' | 'other';
}

export interface TickerItem {
  id: number;
  title: string;
  content: string;
}

export interface AnnouncementResponse {
  ticker_text: string;
  ticker_items: TickerItem[];
  announcements: Announcement[];
}

export interface PriorityInfo {
  label: string;
  color: string;
}

export enum AnnouncementStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  SCHEDULED = 'scheduled'
}

export interface AnnouncementFilters {
  priority?: number;
  status?: AnnouncementStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface FilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  attachmentUrl: string;
  attachmentName: string;
  attachmentType: string;
}