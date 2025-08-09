// Create this as src/components/Debug/NewsApiDebug.tsx
'use client';

import { useEffect } from 'react';
import { debugNewsApi } from '@/lib/newsApi';

export default function NewsApiDebug() {
  useEffect(() => {
    debugNewsApi();
    
    // Test the URLs manually
    const testUrls = [
      'http://localhost:8000/api/news/',
      'http://localhost:8000/api/news/latest/',
      'http://localhost:8000/news/',
      'http://localhost:8000/news/latest/',
    ];

    testUrls.forEach(async (url) => {
      try {
        console.log(`🧪 Testing URL: ${url}`);
        const response = await fetch(url);
        console.log(`${url} -> Status: ${response.status}`);
      } catch (error) {
        console.log(`${url} -> Error: ${error}`);
      }
    });
  }, []);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h3 className="font-bold">News API Debug Info</h3>
      <p>Check the console for debug information</p>
    </div>
  );
}