// src/app/students/exams/page.tsx
'use client';

import StudentsLayout from '@/components/Students/StudentsLayout';
import { useExamInformation } from '@/hooks/useStudents';
import { Calendar, Clock, MapPin, BookOpen, AlertCircle } from 'lucide-react';
import { ExamInformation } from '@/lib/studentsApi';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (timeString: string | null) => {
  if (!timeString) return null;
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getExamTypeColor = (examType: string) => {
  switch (examType) {
    case 'entrance':
      return 'bg-blue-100 text-blue-800';
    case 'midterm':
      return 'bg-yellow-100 text-yellow-800';
    case 'final':
      return 'bg-red-100 text-red-800';
    case 'comprehensive':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getExamTypeText = (examType: string) => {
  return examType.charAt(0).toUpperCase() + examType.slice(1);
};

const ExamCard = ({ exam }: { exam: ExamInformation }) => {
  const examDate = new Date(exam.exam_date);
  const isUpcoming = examDate > new Date();
  const isPast = examDate < new Date();
  const isToday = examDate.toDateString() === new Date().toDateString();

  return (
    <div className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
      isToday ? 'border-red-300 bg-red-50' : 
      isUpcoming ? 'border-blue-200' : 
      'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {exam.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExamTypeColor(exam.exam_type)}`}>
              {getExamTypeText(exam.exam_type)}
            </span>
            {isToday && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Today
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="font-medium">{formatDate(exam.exam_date)}</span>
        </div>

        {exam.exam_time && (
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatTime(exam.exam_time)}</span>
          </div>
        )}

        {exam.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{exam.location}</span>
          </div>
        )}

        {exam.description && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">{exam.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ExamsPage = () => {
  const { exams, loading, error } = useExamInformation();

  if (loading) {
    return (
      <StudentsLayout 
        title="Exam Information"
        description="View upcoming exams, schedules, and important examination details."
      >
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </StudentsLayout>
    );
  }

  if (error) {
    return (
      <StudentsLayout 
        title="Exam Information"
        description="View upcoming exams, schedules, and important examination details."
      >
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Error loading exam information: {error}</p>
          </div>
        </div>
      </StudentsLayout>
    );
  }

  const upcomingExams = exams.filter(exam => new Date(exam.exam_date) >= new Date());
  const pastExams = exams.filter(exam => new Date(exam.exam_date) < new Date());

  return (
    <StudentsLayout 
      title="Exam Information"
      description="View upcoming exams, schedules, and important examination details."
    >
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-blue-600">Total Exams</p>
                <p className="text-xl font-semibold text-blue-900">{exams.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-green-600">Upcoming</p>
                <p className="text-xl font-semibold text-green-900">{upcomingExams.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-gray-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-semibold text-gray-900">{pastExams.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Exams */}
        {upcomingExams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Upcoming Exams
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingExams.map(exam => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </div>
        )}

        {/* Past Exams */}
        {pastExams.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-600" />
              Past Exams
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pastExams.map(exam => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </div>
        )}

        {/* No Exams */}
        {exams.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Exams Scheduled</h3>
            <p className="text-gray-500">There are currently no exams scheduled.</p>
          </div>
        )}
      </div>
    </StudentsLayout>
  );
};

export default ExamsPage;