import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';

interface ServiceSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isAuthenticated: boolean;
  isRequestPage?: boolean;
}

export const ServiceSearch = ({ searchTerm, onSearchChange, isAuthenticated, isRequestPage = false }: ServiceSearchProps) => {
  const addButtonPath = isRequestPage ? '/services/request/add' : '/services/provide/add';
  const buttonText = isRequestPage ? 'הוסף בקשה חדשה' : 'הוסף שירות חדש';
  const loginText = isRequestPage ? 'התחבר כדי להוסיף בקשה' : 'התחבר כדי להוסיף שירות';

  return (
    <div className="flex justify-between items-center">
      {isAuthenticated ? (
        <Link href={addButtonPath}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            {buttonText}
          </Button>
        </Link>
      ) : (
        <Link href="/login">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            {loginText}
          </Button>
        </Link>
      )}
      <div className="relative w-96">
        <Input
          placeholder="חיפוש לפי מילות מפתח..."
          icon={<Search className="w-5 h-5" />}
          className="text-right pr-12"
          dir="rtl"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}