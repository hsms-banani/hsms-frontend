// src/app/students/tuition-fees/page.tsx
'use client';

import StudentsLayout from '@/components/Students/StudentsLayout';
import { useTuitionFees } from '@/hooks/useStudents';
import { DollarSign, Calendar, AlertCircle, CreditCard, Info, Clock } from 'lucide-react';
import { TuitionFee } from '@/lib/studentsApi';

const getFeeTypeColor = (feeType: string) => {
  switch (feeType) {
    case 'tuition':
      return 'bg-blue-100 text-blue-800';
    case 'registration':
      return 'bg-green-100 text-green-800';
    case 'library':
      return 'bg-purple-100 text-purple-800';
    case 'laboratory':
      return 'bg-orange-100 text-orange-800';
    case 'accommodation':
      return 'bg-indigo-100 text-indigo-800';
    case 'other':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getFeeTypeText = (feeType: string) => {
  return feeType.charAt(0).toUpperCase() + feeType.slice(1);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const FeeCard = ({ fee }: { fee: TuitionFee }) => {
  const dueDate = fee.due_date ? new Date(fee.due_date) : null;
  const isOverdue = dueDate && dueDate < new Date();
  const isDueSoon = dueDate && dueDate > new Date() && dueDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
      isOverdue ? 'border-red-300 bg-red-50' : 
      isDueSoon ? 'border-yellow-300 bg-yellow-50' : 
      'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {fee.title}
          </h3>
          <div className="flex items-center space-x-3 mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFeeTypeColor(fee.fee_type)}`}>
              {getFeeTypeText(fee.fee_type)}
            </span>
            {fee.academic_year && (
              <span className="text-sm text-gray-600">
                {fee.academic_year}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {fee.formatted_amount}
          </div>
          {isOverdue && (
            <span className="text-sm text-red-600 font-medium">Overdue</span>
          )}
          {isDueSoon && !isOverdue && (
            <span className="text-sm text-yellow-600 font-medium">Due Soon</span>
          )}
        </div>
      </div>

      {fee.due_date && (
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>Due: {formatDate(fee.due_date)}</span>
        </div>
      )}

      {fee.description && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700">{fee.description}</p>
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          Pay Now
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );
};

const TuitionFeesPage = () => {
  const { fees, loading, error } = useTuitionFees();

  if (loading) {
    return (
      <StudentsLayout 
        title="Tuition Fees"
        description="View fee structure, payment information, and financial obligations."
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
        title="Tuition Fees"
        description="View fee structure, payment information, and financial obligations."
      >
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Error loading tuition fees: {error}</p>
          </div>
        </div>
      </StudentsLayout>
    );
  }

  // Group fees by type
  const groupedFees = fees.reduce((acc, fee) => {
    if (!acc[fee.fee_type]) {
      acc[fee.fee_type] = [];
    }
    acc[fee.fee_type].push(fee);
    return acc;
  }, {} as Record<string, TuitionFee[]>);

  // Calculate totals
  const totalAmount = fees.reduce((sum, fee) => sum + parseFloat(fee.amount), 0);
  const upcomingFees = fees.filter(fee => {
    if (!fee.due_date) return false;
    const dueDate = new Date(fee.due_date);
    return dueDate > new Date();
  });
  const overdueFees = fees.filter(fee => {
    if (!fee.due_date) return false;
    const dueDate = new Date(fee.due_date);
    return dueDate < new Date();
  });

  return (
    <StudentsLayout 
      title="Tuition Fees"
      description="View fee structure, payment information, and financial obligations."
    >
      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-blue-600">Total Fees</p>
                <p className="text-xl font-semibold text-blue-900">${totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-green-600">Upcoming</p>
                <p className="text-xl font-semibold text-green-900">{upcomingFees.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <p className="text-sm text-red-600">Overdue</p>
                <p className="text-xl font-semibold text-red-900">{overdueFees.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-purple-600">Total Items</p>
                <p className="text-xl font-semibold text-purple-900">{fees.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <CreditCard className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Online Payment</h3>
              <p className="text-sm text-green-100">Credit/Debit cards accepted</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <DollarSign className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Bank Transfer</h3>
              <p className="text-sm text-green-100">Direct bank transfers</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <Clock className="w-6 h-6 mb-2" />
              <h3 className="font-semibold">Payment Plans</h3>
              <p className="text-sm text-green-100">Installment options available</p>
            </div>
          </div>
        </div>

        {/* Fees by Category */}
        {Object.entries(groupedFees).map(([feeType, typeFees]) => (
          <div key={feeType} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mr-3 ${getFeeTypeColor(feeType)}`}>
                {getFeeTypeText(feeType)}
              </span>
              ({typeFees.length} {typeFees.length === 1 ? 'item' : 'items'})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {typeFees.map(fee => (
                <FeeCard key={fee.id} fee={fee} />
              ))}
            </div>
          </div>
        ))}

        {/* No Fees */}
        {fees.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Fees Available</h3>
            <p className="text-gray-500">There are currently no tuition fees to display.</p>
          </div>
        )}

        {/* Payment Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Info className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Payment Information</h3>
              <div className="text-blue-800 space-y-2">
                <p>• All payments must be made by the specified due dates to avoid late fees.</p>
                <p>• Payment plans are available for students facing financial difficulties.</p>
                <p>• Contact the Business Office for assistance with payment arrangements.</p>
                <p>• Receipts will be provided for all payments made.</p>
              </div>
              <div className="mt-4 p-3 bg-blue-100 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Business Office:</strong> business@seminary.edu | (555) 123-4568
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Late Payment Policy */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Late Payment Policy</h3>
              <div className="text-yellow-800 space-y-2">
                <p>• A late fee of $25 will be charged for payments received after the due date.</p>
                <p>• Students with outstanding balances may be prevented from registering for classes.</p>
                <p>• Transcripts and diplomas will be withheld until all financial obligations are met.</p>
                <p>• Payment plans must be established before the due date to avoid late fees.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentsLayout>
  );
};

export default TuitionFeesPage;