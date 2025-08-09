// src/app/publications/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publications | Seminary',
  description: 'Explore our academic publications including student research papers and seminary journals',
  keywords: 'publications, research papers, seminary journal, academic articles, theology',
};

export default function PublicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}