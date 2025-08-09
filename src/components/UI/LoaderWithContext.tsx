// components/UI/LoaderWithContext.tsx
'use client';

import { useLoading } from '@/context/LoadingContext';
import { Loader } from './Loader';

interface LoaderWithContextProps {
  showPercentage?: boolean;
}

export default function LoaderWithContext({ showPercentage = false }: LoaderWithContextProps) {
  const { isLoading } = useLoading();
  
  return <Loader showPercentage={showPercentage} isLoading={isLoading} />;
}