// src/app/students/registrar/page.tsx
'use client';

import StudentsLayout from '@/components/Students/StudentsLayout';
import { 
  FileText, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const services = [
  {
    title: 'Academic Records',
    description: 'Official transcripts, grade reports, and academic standing certificates',
    icon: <FileText className="w-6 h-6" />,
    items: [
      'Official transcripts',
      'Unofficial transcripts',
      'Grade reports',
      'Academic standing verification',
      'Enrollment certificates'
    ]
  },
  {
    title: 'Registration Services',
    description: 'Course registration, schedule changes, and enrollment management',
    icon: <CheckCircle className="w-6 h-6" />,
    items: [
      'Course registration',
      'Add/Drop courses',
      'Schedule modifications',
      'Withdrawal procedures',
      'Leave of absence processing'
    ]
  },
  {
    title: 'Degree Services',
    description: 'Graduation requirements, degree audits, and commencement information',
    icon: <User className="w-6 h-6" />,
    items: [
      'Degree requirement audits',
      'Graduation applications',
      'Diploma orders',
      'Commencement information',
      'Academic honors verification'
    ]
  },
  {
    title: 'Student Records',
    description: 'Maintenance of student academic and personal information',
    icon: <FileText className="w-6 h-6" />,
    items: [
      'Personal information updates',
      'Emergency contact changes',
      'Address changes',
      'Name change processing',
      'Student ID replacement'
    ]
  }
];

const officeHours = [
  { day: 'Monday - Friday', hours: '8:00 AM - 5:00 PM' },
  { day: 'Saturday', hours: '9:00 AM - 12:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
];

const importantDates = [
  {
    date: 'August 15-30',
    event: 'Fall Semester Registration',
    type: 'registration'
  },
  {
    date: 'September 5',
    event: 'Last Day to Add Courses',
    type: 'deadline'
  },
  {
    date: 'September 15',
    event: 'Last Day to Drop without "W"',
    type: 'deadline'
  },
  {
    date: 'October 15',
    event: 'Mid-semester Grades Due',
    type: 'academic'
  },
  {
    date: 'November 1',
    event: 'Spring Registration Begins',
    type: 'registration'
  },
  {
    date: 'December 10',
    event: 'Final Grades Due',
    type: 'academic'
  }
];

const forms = [
  {
    title: 'Add/Drop Form',
    description: 'Request to add or drop courses after registration period',
    required: 'Advisor signature required'
  },
  {
    title: 'Withdrawal Form',
    description: 'Official withdrawal from courses or seminary',
    required: 'Dean approval required'
  },
  {
    title: 'Transcript Request',
    description: 'Request official or unofficial transcripts',
    required: 'Student ID and payment'
  },
  {
    title: 'Grade Change Request',
    description: 'Request for correction of recorded grades',
    required: 'Faculty and Dean approval'
  },
  {
    title: 'Leave of Absence',
    description: 'Request temporary leave from studies',
    required: 'Academic and financial clearance'
  }
];

const getDateTypeColor = (type: string) => {
  switch (type) {
    case 'registration':
      return 'bg-blue-100 text-blue-800';
    case 'deadline':
      return 'bg-red-100 text-red-800';
    case 'academic':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const RegistrarPage = () => {
  return (
    <StudentsLayout 
      title="Registrar's Office"
      description="Academic records, registration services, and student information management."
    >
      <div className="p-6">
        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact Registrar's Office</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-blue-100">(555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-blue-100">registrar@seminary.edu</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-blue-100">Administration Building, Room 105</p>
              </div>
            </div>
          </div>
        </div>

        {/* Office Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Office Hours
            </h3>
            <div className="space-y-2">
              {officeHours.map((schedule, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{schedule.day}</span>
                  <span className="font-medium text-gray-900">{schedule.hours}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <Info className="w-4 h-4 inline mr-1" />
                Hours may vary during holidays and semester breaks
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                <div className="font-medium text-blue-900">Request Transcript</div>
                <div className="text-sm text-blue-700">Order official transcripts</div>
              </button>
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors">
                <div className="font-medium text-green-900">Check Degree Audit</div>
                <div className="text-sm text-green-700">View graduation requirements</div>
              </button>
              <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors">
                <div className="font-medium text-purple-900">Update Information</div>
                <div className="text-sm text-purple-700">Change personal details</div>
              </button>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="font-medium text-red-900">After Hours Emergency</p>
                <p className="text-red-700">(555) 123-4570</p>
                <p className="text-sm text-red-600 mt-1">For urgent academic matters only</p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="font-medium text-gray-900">Academic Advisor</p>
                <p className="text-gray-700">advisor@seminary.edu</p>
                <p className="text-sm text-gray-600 mt-1">For academic guidance and support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Registrar Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="text-blue-600 mr-4 mt-1">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-1">
                      {service.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Dates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Important Academic Dates
            </h3>
            <div className="space-y-3">
              {importantDates.map((date, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">{date.event}</p>
                    <p className="text-sm text-gray-600">{date.date}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDateTypeColor(date.type)}`}>
                    {date.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Forms */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Common Forms
            </h3>
            <div className="space-y-3">
              {forms.map((form, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{form.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                      <p className="text-xs text-blue-600 mt-2">{form.required}</p>
                    </div>
                    <button className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Important Notice</h3>
              <p className="text-yellow-800 mb-3">
                All official requests must be submitted in writing with proper documentation. 
                Processing times may vary depending on the complexity of the request and current workload.
              </p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Transcript requests: 3-5 business days</li>
                <li>• Grade changes: 5-10 business days</li>
                <li>• Enrollment verifications: 1-2 business days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </StudentsLayout>
  );
};

export default RegistrarPage;