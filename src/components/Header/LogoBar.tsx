// components/Header/LogoBar.tsx
import Image from 'next/image';
import Link from 'next/link';

// Simple icon components instead of using Heroicons
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const ContactIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const LogoBar = () => {
  return (
    <div className="bg-white shadow-lg py-5 overflow-x-hidden">
      {/* Top section - Language & Address */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-end items-center text-sm mb-2">
        <div className="text-gray-600 mr-6 hidden sm:block">
          <p className="text-right font-medium">Banani, Dhaka, Bangladesh</p>
        </div>
        <div className="flex items-center space-x-3 text-gray-600 border-l pl-4">
          <GlobeIcon />
          <span className="hover:text-blue-600 cursor-pointer transition-colors">English</span>
          <span>|</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">বাংলা</span>
        </div>
      </div>

      {/* Main section - Logo & Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Logo and Seminary Name */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 transition-transform group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="Holy Spirit Major Seminary Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
                className="drop-shadow-md"
              />
            </div>
            <div className="ml-3 sm:ml-5">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors tracking-tight">
                Holy Spirit Major Seminary
              </h1>
              <p className="text-sm sm:text-base text-blue-600 italic font-medium relative pl-1 mt-1">
                <span className="absolute -left-1 top-1/2 h-6 w-1 bg-blue-600 transform -translate-y-1/2 rounded-full opacity-70"></span>
                Dedicated for Service
              </p>
            </div>
          </Link>
        </div>

        {/* Contact Us & Login Buttons */}
        <div className="flex items-center space-x-3">
          <Link href="/contact">
            <button className="flex items-center bg-white border-2 border-blue-600 text-blue-600 px-4 py-2.5 rounded-md hover:bg-blue-50 transition-all shadow-md hover:shadow-lg font-medium">
              <ContactIcon />
              <span className="ml-2 hidden sm:inline">Contact Us</span>
            </button>
          </Link>
          
          <button className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium">
            <UserIcon />
            <span className="ml-2">Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export { LogoBar };