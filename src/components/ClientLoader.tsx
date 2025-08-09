// components/ClientLoader.tsx
'use client';

import { useEffect, useState } from 'react';
import { Loader } from './UI/Loader';

export default function ClientLoader() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Auto-hide loader after some time
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!isLoading) return null;
  
  return <Loader showPercentage={true} />;
}