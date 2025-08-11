// components/Footer.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { 
  EnvelopeIcon, 
  FacebookIcon,
  YouTubeIcon,
  InstagramIcon
} from './icons';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
  {
    title: "About Us",
    links: [
      { name: "Our History", href: "/about/history" },
      { name: "Mission & Vision", href: "/about/mission" },
      { name: "Rector's Message", href: "/about/rector-message" },
      { name: "Faculty & Staff", href: "/academics/faculties/members" },
      { name: "Accreditation", href: "/about/accreditation" },
    ],
  },
  {
    title: "Academics",
    links: [
      { name: "Theology Program", href: "/academics/theology" },
      { name: "Philosophy Program", href: "/academics/philosophy" },
      { name: "Spiritual Formation", href: "/academics/formation" },
      { name: "Library Resources", href: "/academics/library" },
      { name: "Academic Calendar", href: "/academics/calendar" },
    ],
  },
  {
    title: "Seminary Life",
    links: [
      { name: "Daily Schedule", href: "/seminary-life/schedule" },
      { name: "Liturgical Life", href: "/seminary-life/liturgy" },
      { name: "Community Events", href: "/seminary-life/events" },
      { name: "Pastoral Placements", href: "/seminary-life/pastoral" },
      { name: "Photo Gallery", href: "/seminary-life/gallery" },
    ],
  },
  {
    title: "Admissions",
    links: [
      { name: "Application Process", href: "/admissions/process" },
      { name: "Requirements", href: "/admissions/requirements" },
      { name: "Tuition & Financial Aid", href: "/admissions/tuition" },
      { name: "FAQ", href: "/admissions/faq" },
      { name: "Visit the Seminary", href: "/admissions/visit" },
    ],
  },
];

  return (
    <footer className="bg-gray-800 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Seminary Info */}
        <div className="lg:col-span-1">
          <div className="text-2xl font-bold text-white mb-4">Holy Spirit Major Seminary</div>
          <p className="text-gray-300 mb-6">
            “Dedicated for Service”
          </p>
          <div className="space-y-3">
            <div className="flex items-center">
              <EnvelopeIcon className="h-4 w-4 mr-2 text-blue-300" />
              <span className="text-gray-300">hsmsmajorseminary@gmail.com</span>
            </div>
            <div className="text-gray-300">
              Holy Spirit Major Seminary,
              <br />
              Block A-112, Road 27, Banani
              <br />
              Dhaka 1213, Bangladesh
            </div>
          </div>
        </div>

        {/* Footer Links */}
        {footerLinks.map((section) => (
          <div key={section.title} className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-blue-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Holy Spirit Major Seminary. All rights reserved.
          </div>
          
          {/* Social Media */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-300" aria-label="Facebook">
              <FacebookIcon className="h-5 w-5" />
            </a>
            
            <a href="#" className="text-gray-400 hover:text-blue-300" aria-label="YouTube">
              <YouTubeIcon className="h-5 w-5" />
            </a>

            <a href="#" className="text-gray-400 hover:text-blue-300" aria-label="Instagram">
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}