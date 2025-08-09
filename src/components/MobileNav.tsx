// components/MobileNav.tsx
'use client';
import Link from 'next/link';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export function MobileNav({ isOpen, setIsOpen, navItems }: any) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<string | null>(null);

  return (
    <div
      className={`md:hidden fixed inset-0 z-50 bg-white transform shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      {/* Close Button */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-100">
        <span className="text-lg font-semibold text-gray-700">Menu</span>
        <button onClick={() => setIsOpen(false)} className="p-2 text-gray-600 hover:text-red-500">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-60px)]">
        {navItems.map((item: any) => (
          <div key={item.name} className="border-b pb-2">
            <div className="flex justify-between items-center">
              {item.href ? (
                <Link
                  href={item.href}
                  className="block py-3 text-lg font-medium text-gray-800 hover:text-blue-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <span className="block py-3 text-lg font-medium text-gray-800">{item.name}</span>
              )}
              {item.subItems && item.subItems.length > 0 && (
                <button
                  onClick={() =>
                    setOpenSubmenu(openSubmenu === item.name ? null : item.name)
                  }
                  className="p-2"
                  aria-expanded={openSubmenu === item.name}
                  aria-label={`Toggle ${item.name} submenu`}
                >
                  <ChevronDownIcon className={`h-5 w-5 text-gray-600 transition-transform ${
                    openSubmenu === item.name ? 'rotate-180' : ''
                  }`} />
                </button>
              )}
            </div>

            {/* Submenu */}
            {item.subItems && openSubmenu === item.name && (
              <div className="ml-4 border-l border-gray-300 mt-2 pl-4 space-y-2">
                {item.subItems.map((subItem: any) => (
                  <div key={subItem.name}>
                    <div className="flex justify-between items-center">
                      {subItem.href ? (
                        <Link
                          href={subItem.href}
                          className="block py-2 text-gray-600 hover:text-blue-600 transition"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ) : (
                        <span className="block py-2 text-gray-600">{subItem.name}</span>
                      )}
                      {subItem.subItems && subItem.subItems.length > 0 && (
                        <button
                          onClick={() =>
                            setOpenNestedSubmenu(openNestedSubmenu === subItem.name ? null : subItem.name)
                          }
                          className="p-1"
                          aria-expanded={openNestedSubmenu === subItem.name}
                          aria-label={`Toggle ${subItem.name} submenu`}
                        >
                          <ChevronDownIcon className={`h-4 w-4 text-gray-600 transition-transform ${
                            openNestedSubmenu === subItem.name ? 'rotate-180' : ''
                          }`} />
                        </button>
                      )}
                    </div>

                    {/* Nested Submenu */}
                    {subItem.subItems && openNestedSubmenu === subItem.name && (
                      <div className="ml-4 border-l border-gray-300 mt-1 pl-4 space-y-2">
                        {subItem.subItems.map((nestedItem: any) => (
                          nestedItem.href ? (
                            <Link
                              key={nestedItem.name}
                              href={nestedItem.href}
                              className="block py-2 text-gray-600 hover:text-blue-600 transition"
                              onClick={() => setIsOpen(false)}
                            >
                              {nestedItem.name}
                            </Link>
                          ) : (
                            <span key={nestedItem.name} className="block py-2 text-gray-600">
                              {nestedItem.name}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}