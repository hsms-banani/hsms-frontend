// src/components/Students/StudentsLayout.tsx (UPDATED)
'use client';
import { ReactNode } from 'react';
import StudentsSidebar, { SidebarSection } from './StudentsSidebar';
import {
  Users,
  MapPin,
  FileText,
  BookOpen,
  Calendar,
  CreditCard,
  Download,
  HelpCircle,
  Heart,
  UserCheck,
  GraduationCap
} from 'lucide-react';

interface StudentsLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const sidebarSections: SidebarSection[] = [
  {
    title: 'Student Directory',
    items: [
      {
        title: 'Current Students',
        href: '/students/list',
        icon: <Users className="w-4 h-4" />,
        description: 'View all active students'
      },
      {
        title: 'Graduated Students', // NEW
        href: '/students/graduates',
        icon: <GraduationCap className="w-4 h-4" />,
        description: 'View seminary graduates'
      },
      {
        title: 'Congregations & Dioceses',
        href: '/students/congregations',
        icon: <MapPin className="w-4 h-4" />,
        description: 'Geographic representation'
      }
    ]
  },
  {
    title: 'Academic Information',
    items: [
      {
        title: 'Enrollment Requirements',
        href: '/students/enrollment',
        icon: <FileText className="w-4 h-4" />,
        description: 'Admission requirements'
      },
      {
        title: 'Exam Information',
        href: '/students/exams',
        icon: <Calendar className="w-4 h-4" />,
        description: 'Upcoming exams & schedules'
      },
      {
        title: 'Registrar\'s Office',
        href: '/students/registrar',
        icon: <UserCheck className="w-4 h-4" />,
        description: 'Academic records & services'
      }
    ]
  },
  {
    title: 'Financial & Administrative',
    items: [
      {
        title: 'Tuition Fees',
        href: '/students/tuition-fees',
        icon: <CreditCard className="w-4 h-4" />,
        description: 'Fee structure & payments'
      },
      {
        title: 'Forms & Documents',
        href: '/students/forms',
        icon: <Download className="w-4 h-4" />,
        description: 'Downloadable resources'
      }
    ]
  },
  {
    title: 'Support & Guidance',
    items: [
      {
        title: 'FAQs',
        href: '/students/faqs',
        icon: <HelpCircle className="w-4 h-4" />,
        description: 'Frequently asked questions'
      },
      {
        title: 'Spiritual Guidance',
        href: '/students/spiritual-guidance',
        icon: <Heart className="w-4 h-4" />,
        description: 'Spiritual resources & support'
      }
    ]
  }
];

const StudentsLayout = ({ children, title, description }: StudentsLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {title || 'Student Information Center'}
            </h1>
            {description && (
              <p className="mt-2 text-gray-600 max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <StudentsSidebar sections={sidebarSections} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsLayout;