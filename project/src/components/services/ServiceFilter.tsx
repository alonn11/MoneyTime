import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Globe } from 'lucide-react';

interface ServiceFilterProps {
  serviceType: string;
  onTypeChange: (type: string) => void;
}

export const ServiceFilter = ({ serviceType, onTypeChange }: ServiceFilterProps) => {
  return (
    <Card>
      <CardContent className="p-2">
        <div className="flex-1 flex gap-2">
          <Button
            variant={serviceType === 'all' ? 'default' : 'ghost'}
            className="flex-1"
            onClick={() => onTypeChange('all')}
          >
            הכל
          </Button>
          <Button
            variant={serviceType === 'remote' ? 'default' : 'ghost'}
            className="flex-1 gap-2"
            onClick={() => onTypeChange('remote')}
          >
            <Globe className="w-5 h-5" />
            עבודה מרחוק
          </Button>
          <Button
            variant={serviceType === 'local' ? 'default' : 'ghost'}
            className="flex-1 gap-2"
            onClick={() => onTypeChange('local')}
          >
            <MapPin className="w-5 h-5" />
            עבודה מקומית
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};