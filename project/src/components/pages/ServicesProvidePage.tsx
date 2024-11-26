"use client";

import React, { useState, useEffect } from 'react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceFilter } from '@/components/services/ServiceFilter';
import { ServiceSearch } from '@/components/services/ServiceSearch';
import { getServices } from '@/lib/data';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Service } from '@/lib/data';
import { Card, CardContent } from "@/components/ui/card";

export default function ServicesProvidePage() {
  const { user } = useAuth();
  const [serviceType, setServiceType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesType = serviceType === 'all' || service.type === serviceType;
    
    if (!searchTerm) return matchesType;

    const searchTerms = searchTerm.toLowerCase().split(' ');
    const searchableText = [
      service.title.toLowerCase(),
      service.description.toLowerCase(),
      ...(service.keywords?.map(k => k.toLowerCase()) || [])
    ].join(' ');

    return matchesType && searchTerms.every(term => searchableText.includes(term));
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">טוען שירותים...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ServiceSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isAuthenticated={!!user}
      />

      <ServiceFilter 
        serviceType={serviceType}
        onTypeChange={setServiceType}
      />

      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">לא נמצאו תוצאות מתאימות לחיפוש שלך</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}