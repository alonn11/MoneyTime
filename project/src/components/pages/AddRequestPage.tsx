"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Globe, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { addServiceRequest } from '@/lib/data';
import type { ServiceRequest } from '@/lib/data';

export default function AddRequestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [serviceType, setServiceType] = useState<'local' | 'remote'>('local');
  const [budgetType, setBudgetType] = useState<'hour' | 'project'>('hour');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    keywords: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'budget') {
      const numericValue = value.replace(/[^\d]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const requestData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: `₪${formData.budget} ${budgetType === 'hour' ? 'לשעה' : 'לפרויקט'}`,
        type: serviceType,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
        location: serviceType === 'local' ? formData.location.trim() : undefined,
        requester: {
          uid: user.uid,
          name: user.username,
          email: user.email,
          phone: user.phone,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
        }
      };

      await addServiceRequest(requestData);
      router.push('/services/request');
    } catch (error) {
      console.error('Error adding service request:', error);
      setError('אירעה שגיאה בהוספת הבקשה. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>יש להתחבר כדי להוסיף בקשת שירות</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link 
          href="/services/request"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          חזרה לרשימת הבקשות
        </Link>
        <h1 className="text-2xl font-bold">הוספת בקשת שירות</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-medium mb-4 text-right">סוג הבקשה</h2>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={serviceType === 'local' ? 'default' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => setServiceType('local')}
              >
                <MapPin className="w-5 h-5" />
                עבודה מקומית
              </Button>
              <Button
                type="button"
                variant={serviceType === 'remote' ? 'default' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => setServiceType('remote')}
              >
                <Globe className="w-5 h-5" />
                עבודה מרחוק
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-right">כותרת הבקשה</label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="text-right"
                  placeholder="לדוגמה: דרוש מורה לאנגלית"
                  dir="rtl"
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-right">תיאור הבקשה</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 rounded-lg border bg-white text-right resize-none"
                  placeholder="תאר את הבקשה שלך בפירוט..."
                  dir="rtl"
                  required
                  minLength={10}
                  maxLength={1000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-right">תקציב</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="text-right pl-8"
                        placeholder="הכנס סכום"
                        dir="rtl"
                        required
                        pattern="\d+"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₪</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant={budgetType === 'hour' ? 'default' : 'outline'}
                    onClick={() => setBudgetType('hour')}
                  >
                    לשעה
                  </Button>
                  <Button
                    type="button"
                    variant={budgetType === 'project' ? 'default' : 'outline'}
                    onClick={() => setBudgetType('project')}
                  >
                    לפרויקט
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-right">מילות מפתח</label>
                <Input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className="text-right"
                  placeholder="הפרד מילות מפתח בפסיקים"
                  dir="rtl"
                  required
                />
              </div>

              {serviceType === 'local' && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-right">מיקום</label>
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="text-right"
                    placeholder="הכנס כתובת"
                    dir="rtl"
                    required
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
            disabled={loading}
          >
            ביטול
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'מפרסם...' : 'פרסם בקשה'}
          </Button>
        </div>
      </form>
    </div>
  );
}