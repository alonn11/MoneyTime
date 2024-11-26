import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-around py-1">
          <Link 
            href="/services" 
            className={cn(
              "flex flex-col items-center p-1.5 rounded-lg transition-colors min-w-[4rem]",
              pathname === '/services' 
                ? "text-blue-600" 
                : "text-gray-500 hover:text-blue-600"
            )}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-0.5">בית</span>
          </Link>

          <Link 
            href="/profile" 
            className={cn(
              "flex flex-col items-center p-1.5 rounded-lg transition-colors min-w-[4rem]",
              pathname === '/profile' 
                ? "text-blue-600" 
                : "text-gray-500 hover:text-blue-600"
            )}
          >
            <User className="w-5 h-5" />
            <span className="text-xs mt-0.5">פרופיל</span>
          </Link>

          {user?.isAdmin && (
            <Link 
              href="/admin" 
              className={cn(
                "flex flex-col items-center p-1.5 rounded-lg transition-colors min-w-[4rem]",
                pathname === '/admin' 
                  ? "text-blue-600" 
                  : "text-gray-500 hover:text-blue-600"
              )}
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs mt-0.5">ניהול</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}