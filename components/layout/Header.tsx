// components/layout/Header.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useConfig } from '@/lib/hooks/useConfig';

// Inline SVG Icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export const Header: React.FC = () => {
  const { config } = useConfig();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/rooms', label: 'Rooms' },
    { href: '/about', label: 'About' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  // Use fallback values
  const hotelName = config?.hotel_name || 'Luxury Stay Hotel';
  const primaryColor = config?.primary_color || '#3B82F6';
  const contactPhone = config?.contact_phone || '+234 123 456 7890';

  if (!mounted) {
    return null;
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-md py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo / Hotel Name */}
          <Link href="/" className="flex items-center z-10">
            <span className="text-xl md:text-2xl font-bold text-gray-800">
              {hotelName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium text-sm xl:text-base ${
                  pathname === link.href 
                    ? 'text-primary font-semibold' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm text-gray-700 hover:text-primary"
            >
              <PhoneIcon />
              <span>Call</span>
            </a>
            <Link href="/booking">
              <button
                className="px-5 py-2 rounded-lg text-white font-semibold transition-all hover:scale-105 text-sm flex items-center gap-2"
                style={{ backgroundColor: primaryColor }}
              >
                <CalendarIcon />
                Book Now
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden z-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <CloseIcon />
            ) : (
              <MenuIcon />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg mt-2 rounded-b-xl overflow-hidden">
            <div className="flex flex-col p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-gray-800 text-base font-medium py-3 border-b border-gray-100 ${
                    pathname === link.href ? 'text-primary' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/booking">
                <button
                  className="w-full px-5 py-3 rounded-lg text-white font-semibold mt-3 text-sm"
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book Now
                </button>
              </Link>
              <a
                href={`tel:${contactPhone}`}
                className="text-center px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold mt-2 text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Call Now
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};