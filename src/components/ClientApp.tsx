// components/ClientApp.tsx
'use client';

import { LoadingProvider } from '@/context/LoadingContext';
import { Loader } from './UI/Loader';
import { useLoading } from '@/context/LoadingContext';

function LoaderWithContext() {
  const { isLoading } = useLoading();
  if (!isLoading) return null;
  return <Loader showPercentage={true} />;
}

export default function ClientApp({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <LoaderWithContext />
      {children}
    </LoadingProvider>
  );
}