// src/components/Publications/PDFViewer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { PDFViewerProps } from '@/types/publications';
import { X, Download, ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2 } from 'lucide-react';

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  title,
  isOpen,
  onClose
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg shadow-2xl flex flex-col ${
        isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl h-[90vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 truncate" title={title}>
              {title}
            </h2>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            
            <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
              {zoom}%
            </span>
            
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Download PDF"
            >
              <Download size={20} />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <div className="w-full h-full flex items-center justify-center">
            <iframe
              src={`${pdfUrl}#zoom=${zoom}&view=FitH`}
              className="w-full h-full border-0"
              title={title}
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center top',
              }}
            />
          </div>
        </div>

        {/* Alternative fallback for browsers that don't support iframe PDF viewing */}
        <div className="hidden" id="pdf-fallback">
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                PDF Preview Not Available
              </h3>
              <p className="text-gray-600 mb-4">
                Your browser doesn't support PDF preview. Please download the file to view it.
              </p>
              <button
                onClick={handleDownload}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <Download size={16} className="mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;