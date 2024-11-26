"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, MapPin, Globe, Briefcase, Search, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ServicesPage = () => {
  const router = useRouter();
  const [serviceType, setServiceType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    {
      id: 1,
      title: 'שיעורים פרטיים במתמטיקה',
      description: 'מורה מנוסה למתמטיקה, מתמחה בהכנה לבגרות 5 יחידות',
      price: '₪150 לשעה',
      rating: 4.9,
      distance: '2.5',
      availability: 'זמין היום',
      provider: {
        name: 'דני לוי',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        verified: true
      }
    },
    {
      id: 2,
      title: 'פיתוח אתרים',
      description: 'בניית אתרים מותאמים אישית',
      price: '₪200 לשעה',
      rating: 4.8,
      distance: '4.2',
      availability: 'זמין השבוע',
      provider: {
        name: 'רון כהן',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        verified: true
      }
    }
  ];

  const handleContact = (serviceId: number) => {
    router.push(`/contact/${serviceId}`);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          placeholder="חיפוש..."
          icon={<Search className="w-5 h-5" />}
          className="text-right pr-12"
          dir="rtl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-2">
          <div className="flex gap-2 items-center">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex-1 flex gap-2">
              <Button
                variant={serviceType === 'local' ? 'default' : 'ghost'}
                className="flex-1 gap-2"
                onClick={() => setServiceType('local')}
              >
                <MapPin className="w-5 h-5" />
                עבודה מקומית
              </Button>
              <Button
                variant={serviceType === 'remote' ? 'default' : 'ghost'}
                className="flex-1 gap-2"
                onClick={() => setServiceType('remote')}
              >
                <Globe className="w-5 h-5" />
                עבודה מרחוק
              </Button>
              <Button
                variant={serviceType === 'all' ? 'default' : 'ghost'}
                className="flex-1 gap-2"
                onClick={() => setServiceType('all')}
              >
                <Briefcase className="w-5 h-5" />
                הכל
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img src={service.provider.image} alt="" className="w-10 h-10 rounded-full" />
                  <div className="text-right">
                    <div className="font-medium">{service.provider.name}</div>
                    {service.provider.verified && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        מאומת
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-right">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-4 text-right">{service.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-green-600 text-lg">{service.price}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{service.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Button onClick={() => handleContact(service.id)}>
                  יצירת קשר
                </Button>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{service.distance} ק"מ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{service.availability}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;