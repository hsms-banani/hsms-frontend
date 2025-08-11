// components/Header/TopBar.tsx
"use client";

import { 
  EnvelopeIcon,
  FacebookIcon,
  YouTubeIcon
} from '../icons';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { TickerItem } from '@/types/announcements';

const MarqueeText = ({ 
  tickerItems, 
  onItemClick 
}: { 
  tickerItems: TickerItem[];
  onItemClick: (id: number) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const formattedSegments = tickerItems.map((item, index) => (
    <span key={`${item.id}-${index}`} className="inline-flex items-center whitespace-nowrap">
      <span 
        className="px-4 py-1 mx-1 rounded-full bg-amber-200 bg-opacity-60 border border-amber-300 cursor-pointer hover:bg-amber-300 hover:bg-opacity-80 hover:border-amber-400 transition-all duration-300 hover:scale-105 hover:shadow-md text-indigo-900 font-semibold"
        onClick={() => onItemClick(item.id)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        title={`Click to view: ${item.title}`}
      >
        {item.title}
      </span>
      <span className="mx-3 text-amber-600 font-bold text-lg opacity-80">•</span>
    </span>
  ));

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content || tickerItems.length === 0) return;

    let rafId: number;
    let startTime: number | null = null;
    let pausedTime: number = 0;

    const scroll = () => {
      const step = (timestamp: number) => {
        if (isPaused) {
          pausedTime += timestamp - (startTime || timestamp);
          startTime = timestamp;
          rafId = requestAnimationFrame(step);
          return;
        }

        if (!startTime) startTime = timestamp - pausedTime;
        const elapsed = timestamp - startTime - pausedTime;

        // Scroll speed = pixels per ms
        const speed = 0.05;
        const scrollWidth = content.scrollWidth;
        
        if (scrollWidth > 0) {
          content.style.transform = `translateX(-${(elapsed * speed) % scrollWidth}px)`;
        }

        rafId = requestAnimationFrame(step);
      };

      rafId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafId);
    };

    return scroll();
  }, [tickerItems, isPaused]);

  if (tickerItems.length === 0) {
    return (
      <div className="text-center py-2 px-4 bg-transparent rounded-full">
        <span className="text-sm font-medium text-indigo-900 opacity-90">No announcements at this time</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap relative bg-transparent rounded-full shadow-inner"
    >
      <div
        ref={contentRef}
        className={`inline-flex text-sm font-medium tracking-wide transition-opacity duration-200 py-2 ${isPaused ? 'opacity-80' : 'opacity-100'}`}
        style={{ whiteSpace: 'nowrap' }}
      >
        {/* Repeat the content twice to allow seamless scroll */}
        {formattedSegments}
        {formattedSegments}
      </div>
    </div>
  );
};

export function TopBar() {
  const router = useRouter();
  const { tickerItems, isLoading, error, refetch } = useAnnouncements();

  const handleAnnouncementClick = (id: number) => {
    router.push(`/announcements/${id}`);
  };

  return (
    <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 text-indigo-900 py-2 border-b border-amber-500 shadow-lg">
      <div className="max-w-full mx-auto px-2 flex flex-col lg:flex-row justify-between items-center text-sm">
        
        {/* Email - extreme left on desktop */}
        <div className="flex-shrink-0 order-1 lg:order-1 mb-2 lg:mb-0 relative z-50">
          <div className="flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm border border-white border-opacity-30">
            <EnvelopeIcon className="h-4 w-4 mr-2 text-indigo-800" />
            <a 
              href="mailto:hsmsmajorseminary@gmail.com" 
              className="text-sm font-semibold hover:text-indigo-700 transition-colors duration-200"
            >
              hsmsmajorseminary@gmail.com
            </a>
          </div>
        </div>
        
        {/* Marquee text - expanded width */}
        <div className="flex-1 order-3 lg:order-2 w-full lg:w-auto lg:mx-4 lg:px-2 relative z-10">
          {isLoading ? (
            <div className="text-sm font-medium text-center py-2 bg-transparent rounded-full">
              <span className="animate-pulse text-indigo-900 opacity-90">Loading announcements...</span>
            </div>
          ) : (
            <MarqueeText 
              tickerItems={tickerItems} 
              onItemClick={handleAnnouncementClick}
            />
          )}
        </div>
        
        {/* Social icons - right side */}
        <div className="flex-shrink-0 order-2 lg:order-3 flex items-center relative z-50">
          <div className="flex items-center gap-3 bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm border border-white border-opacity-30">
            <a 
              href="https://facebook.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-700 text-indigo-800 transition-all duration-300 hover:scale-110"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-700 text-indigo-800 transition-all duration-300 hover:scale-110"
              aria-label="YouTube"
            >
              <YouTubeIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
        
      </div>
    </div>
  );
}
