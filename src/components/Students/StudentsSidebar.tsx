// src/components/Students/StudentsSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

export interface SidebarItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface StudentsSidebarProps {
  sections: SidebarSection[];
  className?: string;
}

const StudentsSidebar = ({ sections, className = '' }: StudentsSidebarProps) => {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(sections.map(s => s.title)));

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className={`bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <h2 className="text-lg font-semibold">Student Information</h2>
        <p className="text-blue-100 text-sm mt-1">Navigate through student resources</p>
      </div>

      <nav className="p-2">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.title);
          
          return (
            <div key={section.title} className="mb-2">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <span>{section.title}</span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="ml-2 mt-1 space-y-1">
                  {section.items.map((item) => {
                    const active = isActive(item.href);
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center p-2 text-sm rounded-md transition-colors ${
                          active
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {item.icon && (
                          <span className={`mr-2 flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                            {item.icon}
                          </span>
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default StudentsSidebar;