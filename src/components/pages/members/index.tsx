// pages/members/index.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Define the Member type
type Member = {
  id: number;
  name: string;
  position: string;
  ministry: string;
  location: string;
  imageUrl: string;
};

// Generate dummy data for demonstration
const generateDummyMembers = (): Member[] => {
  const positions = [
    'Priest', 'Brother', 'Deacon', 'Seminarian', 'Novice',
    'Provincial Superior', 'Director', 'Formator', 'Teacher', 'Parish Priest'
  ];
  
  const ministries = [
    'Education', 'Parish', 'Formation', 'Administration', 'Social Service',
    'Healthcare', 'Youth Ministry', 'Retreat', 'Mission', 'Elderly Care'
  ];
  
  const locations = [
    'Dhaka', 'Chittagong', 'Sylhet', 'Mymensingh', 'Rajshahi',
    'Khulna', 'Barisal', 'Rangpur', 'Comilla', 'Noakhali'
  ];

  // First names for variety
  const firstNames = [
    'John', 'James', 'Peter', 'Paul', 'Matthew', 'Mark', 'Luke', 'Thomas',
    'Francis', 'Joseph', 'Andrew', 'Philip', 'Bartholomew', 'Simon',
    'Michael', 'Gabriel', 'Raphael', 'Stephen', 'Patrick', 'Benedict',
    'Anthony', 'Augustine', 'Gregory', 'Louis', 'Edward', 'Richard', 'Bernard'
  ];
  
  // Last names for variety
  const lastNames = [
    'Cruz', 'D\'Costa', 'Rozario', 'Gomes', 'Pereira', 'Costa', 'Gonsalves',
    'Correia', 'Rodrigues', 'Gomez', 'Rebeiro', 'Silva', 'Lawrence', 'Biswas',
    'Martin', 'Baroi', 'Mondol', 'Sarker', 'Khan', 'Halder', 'Boiragi', 'Gregory'
  ];

  return Array.from({ length: 90 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return {
      id: i + 1,
      name: `Fr. ${firstName} ${lastName}, CSC`,
      position: positions[Math.floor(Math.random() * positions.length)],
      ministry: ministries[Math.floor(Math.random() * ministries.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      imageUrl: `/api/placeholder/150/150`
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const membersPerPage = 12;

  // Initialize with dummy data
  useEffect(() => {
    const dummyMembers = generateDummyMembers();
    setMembers(dummyMembers);
    setFilteredMembers(dummyMembers);
  }, []);

  // Filter members by letter or search query
  useEffect(() => {
    let result = [...members];
    
    // Apply letter filter
    if (selectedLetter) {
      result = result.filter((member) => 
        member.name.charAt(0).toLowerCase() === selectedLetter.toLowerCase()
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((member) => 
        member.name.toLowerCase().includes(query) ||
        member.position.toLowerCase().includes(query) ||
        member.ministry.toLowerCase().includes(query) ||
        member.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredMembers(result);
    setCurrentPage(1); // Reset to first page after filtering
  }, [selectedLetter, searchQuery, members]);

  // Calculate pagination
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  // Generate alphabet array for filtering
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Handle alphabet filtering
  const handleLetterClick = (letter: string) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-16 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Our Members</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Meet the dedicated members of the Congregation of Holy Cross, St. Joseph Province
          who serve in various ministries across the country.
        </p>
      </div>

      {/* Filtering Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, position, ministry or location..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Alphabet Filter */}
          <div className="flex flex-wrap justify-center gap-1 mb-4">
            <button
              onClick={() => setSelectedLetter(null)}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                selectedLetter === null 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  selectedLetter === letter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Results Summary */}
          <p className="text-center text-gray-600 mb-2">
            {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
            {selectedLetter && ` starting with '${selectedLetter}'`}
            {searchQuery && ` matching '${searchQuery}'`}
          </p>
        </div>

        {/* Members Grid */}
        {currentMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
                <div className="p-4 flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-blue-100">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 text-center mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.position}</p>
                  <div className="w-full mt-2">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <span className="font-semibold mr-2">Ministry:</span>
                      <span>{member.ministry}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-semibold mr-2">Location:</span>
                      <span>{member.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-xl text-gray-600">No members found matching your criteria.</p>
            <button 
              onClick={() => {
                setSelectedLetter(null);
                setSearchQuery('');
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600 z-10'
                        : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  {currentPage > 3 && <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700">...</span>}
                  
                  {currentPage > 5 && (
                    <button
                      onClick={() => paginate(currentPage)}
                      className="bg-blue-600 text-white relative inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium"
                    >
                      {currentPage}
                    </button>
                  )}
                  
                  {currentPage < totalPages - 2 && <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700">...</span>}
                  
                  {currentPage < totalPages - 4 && (
                    <button
                      onClick={() => paginate(totalPages)}
                      className="bg-white text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
                    >
                      {totalPages}
                    </button>
                  )}
                </>
              )}
              
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}