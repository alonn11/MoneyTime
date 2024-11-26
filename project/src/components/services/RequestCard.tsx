"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from 'lucide-react';

interface RequestCardProps {
  request: {
    id: string;
    title: string;
    description: string;
    budget: string;
    type: 'local' | 'remote';
    location?: string;
    keywords?: string[];
    requester: {
      name: string;
      email: string;
      phone: string;
      image: string;
    };
  };
}

export const RequestCard = ({ request }: RequestCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img src={request.requester.image} alt="" className="w-10 h-10 rounded-full" />
            <div className="text-right">
              <div className="font-medium">{request.requester.name}</div>
              <div className="flex items-center gap-2 mt-1 bg-green-50 px-2 py-1 rounded-lg">
                <Phone className="w-3.5 h-3.5 text-green-600" />
                <span className="text-sm font-medium text-green-700">{request.requester.phone}</span>
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            request.type === 'local' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-purple-100 text-purple-700'
          }`}>
            {request.type === 'local' ? 'עבודה מקומית' : 'עבודה מרחוק'}
          </span>
        </div>
        
        <h3 className="font-bold text-lg mb-2 text-right">{request.title}</h3>
        <p className="text-gray-600 text-sm mb-4 text-right">{request.description}</p>
        
        {request.keywords && request.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 justify-end">
            {request.keywords.map((keyword, index) => (
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
          <span className="font-bold text-green-600 text-lg">{request.budget}</span>
          {request.type === 'local' && request.location && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{request.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};