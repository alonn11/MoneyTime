"use client";

import React, { useState, useEffect } from 'react';
import { RequestCard } from '@/components/services/RequestCard';
import { ServiceFilter } from '@/components/services/ServiceFilter';
import { ServiceSearch } from '@/components/services/ServiceSearch';
import { getServiceRequests } from '@/lib/data';
import { useAuth } from '@/lib/hooks/useAuth';
import type { ServiceRequest } from '@/lib/data';
import { Card, CardContent } from "@/components/ui/card";

export default function RequestServicePage() {
  const { user } = useAuth();
  const [serviceType, setServiceType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getServiceRequests();
        setRequests(data);
      } catch (error) {
        console.error('Error loading service requests:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesType = serviceType === 'all' || request.type === serviceType;
    
    if (!searchTerm) return matchesType;

    const searchTerms = searchTerm.toLowerCase().split(' ');
    const searchableText = [
      request.title.toLowerCase(),
      request.description.toLowerCase(),
      ...(request.keywords?.map(k => k.toLowerCase()) || [])
    ].join(' ');

    return matchesType && searchTerms.every(term => searchableText.includes(term));
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">טוען בקשות שירות...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ServiceSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isAuthenticated={!!user}
        isRequestPage={true}
      />

      <ServiceFilter 
        serviceType={serviceType}
        onTypeChange={setServiceType}
      />

      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">לא נמצאו תוצאות מתאימות לחיפוש שלך</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map(request => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}