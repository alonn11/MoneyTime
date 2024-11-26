import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  const isProvide = pathname === '/services' || pathname === '/services/provide';
  const isRequest = pathname === '/services/request';

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mb-6">
      <div className="grid grid-cols-2 gap-2 p-2">
        <Link
          href="/services"
          className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 text-center
            ${isProvide 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
              : 'hover:bg-gray-50 text-gray-600'}`}
        >
          נתינת שירות
        </Link>
        <Link
          href="/services/request"
          className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 text-center
            ${isRequest 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
              : 'hover:bg-gray-50 text-gray-600'}`}
        >
          בקשת שירות
        </Link>
      </div>
    </div>
  );
}