// src/app/students/forms/page.tsx
'use client';

import { useState } from 'react';
import StudentsLayout from '@/components/Students/StudentsLayout';
import { useDocuments } from '@/hooks/useStudents';
import { 
  Download, 
  FileText, 
  Search, 
  Filter, 
  AlertCircle, 
  File,
  ExternalLink,
  Star
} from 'lucide-react';
import { Document } from '@/lib/studentsApi';

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'forms':
      return 'bg-blue-100 text-blue-800';
    case 'requirements':
      return 'bg-green-100 text-green-800';
    case 'guidelines':
      return 'bg-purple-100 text-purple-800';
    case 'handbooks':
      return 'bg-orange-100 text-orange-800';
    case 'applications':
      return 'bg-red-100 text-red-800';
    case 'other':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryText = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return <File className="w-5 h-5 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileText className="w-5 h-5 text-blue-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <File className="w-5 h-5 text-green-500" />;
    default:
      return <File className="w-5 h-5 text-gray-500" />;
  }
};

const DocumentCard = ({ document }: { document: Document }) => {
  const handleDownload = () => {
    if (document.file_url) {
      window.open(document.file_url, '_blank');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            {getFileIcon(document.file)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              {document.title}
              {document.is_required && (
                <Star className="w-4 h-4 text-yellow-500 ml-2 flex-shrink-0" />
              )}
            </h3>
            <div className="flex items-center space-x-3 mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(document.category)}`}>
                {getCategoryText(document.category)}
              </span>
              {document.file_size_formatted && (
                <span className="text-sm text-gray-500">
                  {document.file_size_formatted}
                </span>
              )}
              {document.is_required && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  Required
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {document.description && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700">{document.description}</p>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={handleDownload}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
        {document.file_url && (
          <button
            onClick={() => window.open(document.file_url, '_blank')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex items-center"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const FormsDocumentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { documents, loading, error } = useDocuments(selectedCategory || undefined);

  // Filter documents based on search term
  const filteredDocuments = documents.filter(document =>
    document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique categories
  const categories = ['forms', 'requirements', 'guidelines', 'handbooks', 'applications', 'other'];

  // Group documents by category
  const groupedDocuments = filteredDocuments.reduce((acc, document) => {
    if (!acc[document.category]) {
      acc[document.category] = [];
    }
    acc[document.category].push(document);
    return acc;
  }, {} as Record<string, Document[]>);

  // Get required documents
  const requiredDocuments = filteredDocuments.filter(doc => doc.is_required);

  if (loading) {
    return (
      <StudentsLayout 
        title="Forms & Documents"
        description="Download essential forms, documents, and resources for students."
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
        title="Forms & Documents"
        description="Download essential forms, documents, and resources for students."
      >
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Error loading documents: {error}</p>
          </div>
        </div>
      </StudentsLayout>
    );
  }

  return (
    <StudentsLayout 
      title="Forms & Documents"
      description="Download essential forms, documents, and resources for students."
    >
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-blue-600">Total Documents</p>
                <p className="text-xl font-semibold text-blue-900">{documents.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Star className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-yellow-600">Required Documents</p>
                <p className="text-xl font-semibold text-yellow-900">{requiredDocuments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Download className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-green-600">Categories</p>
                <p className="text-xl font-semibold text-green-900">{Object.keys(groupedDocuments).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {getCategoryText(category)}
                </option>
              ))}
            </select>

            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Required Documents Section */}
        {requiredDocuments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              Required Documents
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                These documents are required for all students. Please ensure you have downloaded and completed them as needed.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {requiredDocuments.map(document => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          </div>
        )}

        {/* Documents by Category */}
        {Object.entries(groupedDocuments).map(([category, categoryDocuments]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mr-3 ${getCategoryColor(category)}`}>
                {getCategoryText(category)}
              </span>
              ({categoryDocuments.length} {categoryDocuments.length === 1 ? 'document' : 'documents'})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categoryDocuments.map(document => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          </div>
        ))}

        {/* No Documents */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory
                ? 'Try adjusting your search criteria or filters.'
                : 'No documents are currently available.'}
            </p>
          </div>
        )}

        {/* Information Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Document Guidelines</h3>
              <div className="text-blue-800 space-y-2">
                <p>• All forms must be completed accurately and submitted by the specified deadlines.</p>
                <p>• Required documents are marked with a star (⭐) and must be completed by all students.</p>
                <p>• If you have trouble accessing or completing any document, contact the Registrar's Office.</p>
                <p>• Keep copies of all submitted documents for your records.</p>
              </div>
              <div className="mt-4 p-3 bg-blue-100 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Need Help?</strong> Contact the Registrar's Office at registrar@seminary.edu or (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentsLayout>
  );
};

export default FormsDocumentsPage;