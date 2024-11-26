"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn } from '@/lib/utils';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-gradient-to-l from-blue-600 via-blue-500 to-purple-500 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
              </Button>

              <Link 
                href="/profile"
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm transition-colors",
                  pathname === '/profile' 
                    ? "bg-white/20" 
                    : "hover:bg-white/10"
                )}
              >
                <User className="w-4 h-4" />
                <span className="font-medium">אזור אישי</span>
              </Link>

              {user?.isAdmin && (
                <Link 
                  href="/admin"
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm transition-colors",
                    pathname === '/admin' 
                      ? "bg-white/20" 
                      : "hover:bg-white/10"
                  )}
                >
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">ניהול</span>
                </Link>
              )}
            </div>

            <Link href="/services" className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                MoneyTime
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}