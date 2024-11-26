"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    price: string;
    type: 'local' | 'remote';
    location?: string;
    keywords?: string[];
    provider: {
      name: string;
      email: string;
      phone: string;
      image: string;
    };
  };
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img src={service.provider.image} alt="" className="w-10 h-10 rounded-full" />
            <div className="text-right">
              <div className="font-medium">{service.provider.name}</div>
              <div className="flex items-center gap-2 mt-1 bg-green-50 px-2 py-1 rounded-lg">
                <Phone className="w-3.5 h-3.5 text-green-600" />
                <span className="text-sm font-medium text-green-700">{service.provider.phone}</span>
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            service.type === 'local' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-purple-100 text-purple-700'
          }`}>
            {service.type === 'local' ? 'עבודה מקומית' : 'עבודה מרחוק'}
          </span>
        </div>
        
        <h3 className="font-bold text-lg mb-2 text-right">{service.title}</h3>
        <p className="text-gray-600 text-sm mb-4 text-right">{service.description}</p>
        
        {service.keywords && service.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 justify-end">
            {service.keywords.map((keyword, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-green-600 text-lg">{service.price}</span>
          {service.type === 'local' && service.location && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{service.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};