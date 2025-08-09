// src/types/publications.ts
export interface Publication {
  id: number;
  title: string;
  issue?: string; // Only for Diptto Sakhyo
  pdf_file: string;
  file_url: string;
  thumbnail?: string;
  thumbnail_url?: string;
  date_published: string;
  formatted_date: string;
  is_featured: boolean;
  download_count: number;
  file_size: string;
}

export interface PublicationCardProps {
  publication: Publication;
  type: 'ankur' | 'diptto-sakhyo';
  onView?: (publication: Publication) => void;
  onDownload?: (publication: Publication) => void;
}

export interface PDFViewerProps {
  pdfUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}