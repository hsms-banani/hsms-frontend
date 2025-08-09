// src/app/academics/faculties/members/page.tsx
import { Metadata } from 'next';
import FacultyMembersClient from '@/components/Academics/FacultyMembersClient';

export const metadata: Metadata = {
  title: 'Faculty Members | Holy Spirit Major Seminary',
  description: 'Meet our distinguished faculty members - dedicated educators and researchers committed to excellence in teaching and advancing knowledge in their fields.',
  openGraph: {
    title: 'Faculty Members | Holy Spirit Major Seminary',
    description: 'Meet our distinguished faculty members - dedicated educators and researchers committed to excellence in teaching and advancing knowledge in their fields.',
    type: 'website',
  },
};

export default function FacultyMembersPage() {
  return <FacultyMembersClient />;
}