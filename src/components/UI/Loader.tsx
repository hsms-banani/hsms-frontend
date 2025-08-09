// components/UI/Loader.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoaderProps {
  showPercentage?: boolean;
}

export function Loader({ showPercentage = false }: LoaderProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [imageSrc, setImageSrc] = useState('/images/logo.png');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 10);
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleImageError = () => {
    if (imageSrc === '/images/logo.png') {
      // Try an alternative path
      setImageSrc('/logo.png');
    } else {
      // If alternative path also fails, show fallback
      setImageError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      {!imageError ? (
        <div className="relative w-24 h-24 mb-6 animate-pulse">
          <Image 
            src={imageSrc}
            alt="St. Joseph Province" 
            fill 
            className="object-contain"
            priority
            onError={handleImageError}
          />
        </div>
      ) : (
        <div className="w-24 h-24 mb-6 flex items-center justify-center animate-pulse bg-blue-100 rounded-full">
          <div className="text-blue-600 text-2xl font-bold">HC</div>
        </div>
      )}
      
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      
      {showPercentage && (
        <div className="mt-2 text-blue-600 font-medium">
          {loadingProgress}%
        </div>
      )}
      
      <div className="mt-4 text-gray-500 text-sm">
        St. Joseph Province
      </div>
    </div>
  );
}