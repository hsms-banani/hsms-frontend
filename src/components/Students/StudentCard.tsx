// src/components/Students/StudentCard.tsx
'use client';

import Image from 'next/image';
import { Student } from '@/lib/studentsApi';
import { Mail, Phone, MapPin, Calendar, User } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  className?: string;
}

const StudentCard = ({ student, className = '' }: StudentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'graduated':
        return 'bg-blue-100 text-blue-800';
      case 'transferred':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Student Photo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
            {student.photo_url ? (
              <Image
                src={student.photo_url}
                alt={student.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center ${student.photo_url ? 'hidden' : ''}`}>
              <User className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {student.name}
              </h3>
              {student.student_id && (
                <p className="text-sm text-gray-500 mt-1">
                  ID: {student.student_id}
                </p>
              )}
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
              {getStatusText(student.status)}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {/* Congregation & Diocese */}
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {student.congregation}, {student.diocese}
              </span>
            </div>

            {/* Year Joined */}
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Joined in {student.year_joined}</span>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col space-y-1">
              {student.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a 
                    href={`mailto:${student.email}`}
                    className="truncate hover:text-blue-600 transition-colors"
                  >
                    {student.email}
                  </a>
                </div>
              )}

              {student.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a 
                    href={`tel:${student.phone}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {student.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;