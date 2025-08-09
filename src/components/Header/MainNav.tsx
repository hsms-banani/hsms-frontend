// components/Header/MainNav.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { MobileNav } from '../MobileNav';

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<Record<string, NodeJS.Timeout | null>>({});
  const pathname = usePathname();

  // Handle mouse enter: Clear timeout and open dropdown
  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current[name]) {
      clearTimeout(timeoutRef.current[name]!);
    }
    setActiveDropdown(name);
  };

  // Handle mouse leave with delay to avoid instant closing
  const handleMouseLeave = (name: string) => {
    timeoutRef.current[name] = setTimeout(() => {
      setActiveDropdown(prev => (prev === name ? null : prev));
    }, 300); // Delay for smoother transition
  };

  // Cleanup timeouts when component unmounts
  useEffect(() => {
    return () => {
      Object.values(timeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  // Check if current path matches item or any of its subitems
  const isActiveLink = (item: any): boolean => {
    if (item.href && pathname === item.href) {
      return true;
    }
    
    if (item.subItems) {
      return item.subItems.some((subItem: any) => {
        if (subItem.href && pathname === subItem.href) {
          return true;
        }
        if (subItem.subItems) {
          return subItem.subItems.some((nestedSubItem: any) => pathname === nestedSubItem.href);
        }
        return false;
      });
    }
    
    return false;
  };

  const navItems = [
    { name: "Home", href: "/" },
    
    {
        name: "Our Seminary",
        subItems: [
            { name: "Rector's Message", href: "/about/rector-message" },
            { name: "Mission & Vision", href: "/students/graduates" },
            { name: "History", href: "/students/congregations" },
            { name: "Formation of the Seminary", href: "/students/enrollment" },
            { name: "Rules & Regulations", href: "/students/exams" },
            { name: "Seminary Formation Program", href: "/students/registrar" },
            { name: "Committees", href: "/students/tuition-fees" },
            { name: "Site Map", href: "/students/forms" },
        ],
    },
    {
        name: "History & Heritage",
        subItems: [
            { name: "Brief History of the Church", href: "/about/rector-message" },
            { name: "History of Bangladesh", href: "/students/graduates" },
            { name: "Local Church History", href: "/students/congregations" },
        ],
    },

    {
        name: "About HSIT",
        subItems: [
            { name: "Director’s Message", href: "/about/rector-message" },
            { name: "Secretary", href: "/students/graduates" },
            { name: "Department of Philosophy", href: "/students/congregations" },
            { name: "Department of Theology", href: "/students/enrollment" },
            { name: "Academic Authorities", href: "/students/exams" },
            { name: "Academic Calendar", href: "/academics/calendar" },
            { name: "Professors’ List", href: "/students/tuition-fees" },
            { name: "Course Descriptions", href: "/students/forms" },
            { name: "Research Papers &Thesis", href: "/students/forms" },
            { name: "Library", href: "/students/forms" },
        ],
    },

    {
        name: "Student",
        subItems: [
            { name: "List of Students", href: "/students/list" },
            { name: "Congregations & Diocesan Representation", href: "/students/forms" },
            { name: "Enrollment Requirements", href: "/students/forms" },
            { name: "Exam Information", href: "/students/forms" },
            { name: "Registrar’s Office", href: "/students/forms" },
            { name: "Tuition Fees", href: "/students/forms" },
            { name: "Forms & Documents", href: "/students/forms" },
            { name: "Frequently Asked Questions", href: "/students/forms" },
        ],
    },
    
    {
        name: "Publications",
        subItems: [
            { name: "Ankur: Student Research Papers & Articles", href: "/publications/ankur" },
            { name: "Diptto Sakhyo: Seminary Journal", href: "/publications/diptto-sakhyo" },
            { name: "Prodipon: Theological Journal", href: "/publications/diptto-sakhyo" },
        ],
    },
    {
        name: "Spiritual Food",
        subItems: [
            { name: "Prayer Services", href: "/students/list" },
            { name: "Homilies", href: "/students/graduates" },
            { name: "Spiritual Director’s Desk", href: "/students/congregations" },
        ],
    },
    {
        name: "Events",
        subItems: [
            { name: "Upcoming Seminars & Programs", href: "/students/list" },
            { name: "Photo Gallery", href: "/students/graduates" },
            { name: "Video Gallery", href: "/students/congregations" },
        ],
    },
    // { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = isActiveLink(item);
                
                return (
                  <div 
                    key={item.name} 
                    className="relative"
                    onMouseEnter={() => item.subItems && handleMouseEnter(item.name)}
                    onMouseLeave={() => item.subItems && handleMouseLeave(item.name)}
                  >
                    <div 
                      className={`flex items-center h-full px-4 py-2 rounded-md cursor-pointer font-medium transition-all ${
                        isActive 
                          ? 'text-blue-600 bg-blue-50'
                          : activeDropdown === item.name
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.href ? (
                        <Link href={item.href} className="flex items-center">
                          {item.name}
                        </Link>
                      ) : (
                        <span>{item.name}</span>
                      )}
                      {item.subItems && (
                        <ChevronDownIcon 
                          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </div>
                    
                    {/* First Level Dropdown Menu */}
                    {item.subItems && (
                      <div 
                        className={`absolute top-full left-0 bg-white shadow-lg rounded-md py-2 mt-1 min-w-[220px] border border-gray-100 transition-all duration-200 ${
                          activeDropdown === item.name 
                            ? 'opacity-100 translate-y-0 visible' 
                            : 'opacity-0 -translate-y-2 invisible'
                        }`}
                        onMouseEnter={() => handleMouseEnter(item.name)}
                        onMouseLeave={() => handleMouseLeave(item.name)}
                      >
                        {item.subItems.map((subItem: any) => {
                          const isSubItemActive = pathname === subItem.href || 
                            (subItem.subItems && subItem.subItems.some((nestedItem: any) => pathname === nestedItem.href));
                          
                          return (
                            <div key={subItem.name} className="relative group">
                              {subItem.href ? (
                                <Link
                                  href={subItem.href}
                                  className={`block px-4 py-2 transition-colors ${
                                    isSubItemActive
                                      ? 'bg-blue-50 text-blue-600 font-medium'
                                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                  }`}
                                >
                                  {subItem.name}
                                </Link>
                              ) : (
                                <div
                                  className={`flex items-center justify-between px-4 py-2 transition-colors cursor-pointer ${
                                    isSubItemActive
                                      ? 'bg-blue-50 text-blue-600 font-medium'
                                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                  }`}
                                >
                                  {subItem.name}
                                  {subItem.subItems && (
                                    <ChevronDownIcon className="h-4 w-4 -rotate-90" />
                                  )}
                                </div>
                              )}
                              
                              {/* Second Level Dropdown (Nested) */}
                              {subItem.subItems && (
                                <div className="absolute left-full top-0 bg-white shadow-lg rounded-md py-2 min-w-[220px] border border-gray-100 
                                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 -ml-2">
                                  {subItem.subItems.map((nestedItem: any) => {
                                    const isNestedItemActive = pathname === nestedItem.href;
                                    
                                    return (
                                      <Link
                                        key={nestedItem.name}
                                        href={nestedItem.href}
                                        className={`block px-4 py-2 transition-colors ${
                                          isNestedItemActive
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                      >
                                        {nestedItem.name}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>
      <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} navItems={navItems} />
    </>
  );
}