// app/announcements/page.tsx
"use client";

import React from 'react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { 
  CalendarIcon, 
  ClockIcon, 
  DocumentArrowDownIcon,
  EyeIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

// File type icons component
const FileTypeIcon = ({ type, className }: { type: string; className?: string }) => {
  const iconClass = className || "h-5 w-5";
  
  switch (type) {
    case 'pdf':
      return (
        <svg className={`${iconClass} text-red-500`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    case 'image':
      return (
        <svg className={`${iconClass} text-green-500`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
        </svg>
      );
    case 'document':
      return (
        <svg className={`${iconClass} text-blue-500`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    default:
      return <DocumentArrowDownIcon className={`${iconClass} text-gray-500`} />;
  }
};

interface AnnouncementCardProps {
  announcement: any;
}

const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  const navigate = (e: React.MouseEvent) => {
    // Only navigate if clicking on the card itself, not on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    window.location.href = `/announcements/${announcement.id}`;
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityInfo = (priority: number) => {
    if (priority >= 5) return { 
      label: 'High Priority', 
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-red-500'
    };
    if (priority >= 3) return { 
      label: 'Medium Priority', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: InformationCircleIcon,
      iconColor: 'text-yellow-500'
    };
    return { 
      label: 'Normal', 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircleIcon,
      iconColor: 'text-green-500'
    };
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const priorityInfo = getPriorityInfo(announcement.priority);
  const PriorityIcon = priorityInfo.icon;

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 group cursor-pointer"
      onClick={navigate}
    >
      {/* Header with priority and date */}
      <div className="bg-gradient-to-r from-gray-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${priorityInfo.color}`}>
              <PriorityIcon className={`h-3 w-3 mr-1 ${priorityInfo.iconColor}`} />
              {priorityInfo.label}
            </span>
            {announcement.attachment_url && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <FileTypeIcon type={announcement.attachment_type || 'other'} className="h-3 w-3 mr-1" />
                Attachment
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {formatDate(announcement.created_at)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 flex-1 pr-4">
            {announcement.title}
          </h3>
          <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200 flex-shrink-0 mt-1" />
        </div>

        <p className="text-gray-600 leading-relaxed mb-4 text-sm">
          {truncateContent(announcement.content)}
        </p>

        {/* Footer with metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <ClockIcon className="h-4 w-4 mr-1" />
            {formatTime(announcement.created_at)}
            {announcement.updated_at !== announcement.created_at && (
              <span className="ml-3 px-2 py-1 bg-gray-100 rounded-md">
                Updated {formatDate(announcement.updated_at)}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Link
              href={`/announcements/${announcement.id}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
    <div className="animate-pulse">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-6 bg-gray-200 rounded-full w-24"></div>
            <div className="h-6 bg-gray-200 rounded-md w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function AnnouncementsPage() {
  const { fetchAllAnnouncements } = useAnnouncements();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch announcements on component mount
  React.useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setIsLoading(true);
        await fetchAllAnnouncements();
        
        // Get announcements from the hook's state
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcements/api/announcements/`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setAnnouncements(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load announcements');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnnouncements();
  }, [fetchAllAnnouncements]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-red-500 mb-6">
              <ExclamationTriangleIcon className="mx-auto h-16 w-16" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Unable to Load Announcements</h1>
            <p className="text-gray-600 mb-8 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Announcements
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news, events, and important information from our Institution
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1 max-w-4xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <div className="text-gray-400 mb-6">
              <InformationCircleIcon className="mx-auto h-16 w-16" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Announcements Yet</h2>
            <p className="text-gray-600 text-lg">
              Check back later for updates and important information from our community.
            </p>
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {announcements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {!isLoading && announcements.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-200">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-gray-700 font-medium">
                Showing {announcements.length} active announcement{announcements.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}