// app/announcements/[id]/page.tsx
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAnnouncementDetail } from '@/hooks/useAnnouncements';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  ClockIcon, 
  DocumentArrowDownIcon, 
  ShareIcon,
  EyeIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

// File type icons
const FileTypeIcon = ({ type, className }: { type: string; className?: string }) => {
  const iconClass = className || "h-8 w-8";
  
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

// Enhanced Preview Modal Component with industry best practices
const EnhancedPreviewModal = ({ 
  isOpen, 
  onClose, 
  attachmentUrl, 
  attachmentName, 
  attachmentType 
}: {
  isOpen: boolean;
  onClose: () => void;
  attachmentUrl: string;
  attachmentName: string;
  attachmentType: string;
}) => {
  const [pdfError, setPdfError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setPdfError(false);
    }
  }, [isOpen, attachmentUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = attachmentUrl;
    link.download = attachmentName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenExternal = () => {
    window.open(attachmentUrl, '_blank', 'noopener,noreferrer');
  };

  const renderPDFViewer = () => {
    // Use Google Docs Viewer as primary method - most reliable
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(attachmentUrl)}&embedded=true`;
    
    return (
      <div className="relative w-full h-[75vh] bg-gray-100 rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}
        
        {!pdfError ? (
          <iframe
            src={googleViewerUrl}
            className="w-full h-full border-0"
            title={attachmentName}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setPdfError(true);
            }}
          />
        ) : (
          // Fallback UI when PDF can't be embedded
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <FileTypeIcon type="pdf" className="h-20 w-20 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">PDF Ready to View</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                This PDF is ready to view or download. Choose your preferred option below.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleOpenExternal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center justify-center font-medium"
                >
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
                  Open in New Tab
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center justify-center font-medium"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Buttons - Always visible for PDFs */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleOpenExternal}
            className="bg-white/95 hover:bg-white text-gray-700 px-3 py-2 rounded-lg shadow-lg transition duration-200 flex items-center text-sm font-medium backdrop-blur-sm"
            title="Open in new tab"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
            Open
          </button>
          <button
            onClick={handleDownload}
            className="bg-indigo-600/95 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg shadow-lg transition duration-200 flex items-center text-sm font-medium backdrop-blur-sm"
            title="Download PDF"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
            Download
          </button>
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    switch (attachmentType) {
      case 'image':
        return (
          <div className="p-6">
            <div className="flex justify-center">
              <img 
                src={attachmentUrl} 
                alt={attachmentName}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onLoad={() => setIsLoading(false)}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  setIsLoading(false);
                }}
              />
            </div>
          </div>
        );
      case 'pdf':
        return renderPDFViewer();
      default:
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <FileTypeIcon type={attachmentType} className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">File Ready for Download</h3>
              <p className="text-gray-600 mb-6">Preview not available for this file type</p>
              <button
                onClick={handleDownload}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 inline-flex items-center font-medium"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Download File
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl max-h-[95vh] w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center min-w-0 flex-1">
            <FileTypeIcon type={attachmentType} className="h-6 w-6 mr-3 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{attachmentName}</h3>
              <p className="text-sm text-gray-500 capitalize">
                {attachmentType} file
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
            {attachmentType !== 'pdf' && (
              <button
                onClick={handleDownload}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center text-sm font-medium"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Download
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition duration-200 p-2 rounded-lg hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative overflow-hidden max-h-[calc(95vh-120px)]">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const { announcement, isLoading, error } = useAnnouncementDetail(id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const getPriorityLabel = (priority: number) => {
    if (priority >= 5) return { label: 'High Priority', color: 'bg-red-100 text-red-800 border-red-200' };
    if (priority >= 3) return { label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { label: 'Normal', color: 'bg-green-100 text-green-800 border-green-200' };
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: announcement?.title,
          text: announcement?.content,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="animate-pulse">
              <div className="bg-gradient-to-r from-indigo-400 to-purple-400 h-48"></div>
              <div className="p-8">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-red-500 mb-6">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-8 text-lg">{error}</p>
            <div className="space-x-4">
              <Link 
                href="/announcements"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold inline-block"
              >
                Back to Announcements
              </Link>
              <Link 
                href="/"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold inline-block"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!announcement) return null;

  const priorityInfo = getPriorityLabel(announcement.priority);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <Link 
              href="/announcements"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition duration-200 mb-6 font-semibold"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Announcements
            </Link>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Announcement Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 px-8 py-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center mb-4">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${priorityInfo.color.replace('bg-', 'bg-white/20 border-white/30 text-')}`}>
                          {priorityInfo.label}
                        </span>
                      </div>
                      <h1 className="text-4xl font-bold mb-4 leading-tight">
                        {announcement.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-6 text-indigo-100">
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 mr-2" />
                          <span className="font-medium">{formatDate(announcement.created_at)}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-5 w-5 mr-2" />
                          <span className="font-medium">{formatTime(announcement.created_at)}</span>
                        </div>
                        {announcement.updated_at !== announcement.created_at && (
                          <div className="flex items-center">
                            <span className="text-sm font-medium opacity-80">
                              Updated: {formatDate(announcement.updated_at)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={handleShare}
                        className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition duration-200 backdrop-blur-sm"
                        title="Share this announcement"
                      >
                        <ShareIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Announcement Content */}
              <div className="px-8 py-8">
                <div className="prose max-w-none">
                  <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                    {announcement.content}
                  </div>
                </div>

                {/* Attachment Section */}
                {announcement.attachment_url && (
                  <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <FileTypeIcon type={announcement.attachment_type || 'other'} className="h-7 w-7 mr-3" />
                      Attachment Available
                    </h3>
                    <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="bg-indigo-100 p-3 rounded-lg mr-4 flex-shrink-0">
                            <FileTypeIcon type={announcement.attachment_type || 'other'} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-lg truncate">
                              {announcement.attachment_name || 'Download Attachment'}
                            </p>
                            <div className="flex items-center text-gray-500 text-sm mt-1">
                              {announcement.attachment_size && (
                                <span className="mr-3">Size: {announcement.attachment_size}</span>
                              )}
                              <span className="capitalize">Type: {announcement.attachment_type || 'Unknown'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                          <button
                            onClick={() => setIsPreviewOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center font-semibold shadow-md"
                          >
                            <EyeIcon className="h-5 w-5 mr-2" />
                            {announcement.attachment_type === 'pdf' ? 'View PDF' : 'Preview'}
                          </button>
                          <button
                            onClick={() => handleDownload(announcement.attachment_url!, announcement.attachment_name!)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition duration-200 flex items-center font-semibold"
                          >
                            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Preview Modal */}
      {announcement.attachment_url && (
        <EnhancedPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          attachmentUrl={announcement.attachment_url}
          attachmentName={announcement.attachment_name || 'Attachment'}
          attachmentType={announcement.attachment_type || 'other'}
        />
      )}
    </>
  );
}