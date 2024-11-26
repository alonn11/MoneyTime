"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Service, ServiceRequest } from '@/lib/data';
import { ArrowRight, Briefcase, FileText, Mail, Phone, User, Trash2, Home } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      if (!user?.uid) return;

      try {
        // Fetch user's services
        const servicesQuery = query(
          collection(db, 'services'),
          where('provider.uid', '==', user.uid)
        );
        const servicesSnapshot = await getDocs(servicesQuery);
        const servicesData = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        setServices(servicesData);

        // Fetch user's requests
        const requestsQuery = query(
          collection(db, 'service-requests'),
          where('requester.uid', '==', user.uid)
        );
        const requestsSnapshot = await getDocs(requestsQuery);
        const requestsData = requestsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ServiceRequest[];
        setRequests(requestsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.uid) {
      fetchData();
    }
  }, [user, loading, router]);

  const handleDeleteService = async (serviceId: string) => {
    if (!serviceId) return;
    
    try {
      setDeleteLoading(prev => ({ ...prev, [serviceId]: true }));
      await deleteDoc(doc(db, 'services', serviceId));
      setServices(prev => prev.filter(service => service.id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!requestId) return;
    
    try {
      setDeleteLoading(prev => ({ ...prev, [requestId]: true }));
      await deleteDoc(doc(db, 'service-requests', requestId));
      setRequests(prev => prev.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error deleting request:', error);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/services"
          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm"
        >
          <Home className="w-4 h-4" />
          <span>חזרה לדף הבית</span>
        </Link>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          האזור האישי שלי
        </h1>
      </div>

      <div className="space-y-6">
        {/* User Info Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4 border-b pb-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg text-white">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold">פרטים אישיים</h2>
              <p className="text-xs text-gray-500">המידע האישי שלך</p>
            </div>
          </div>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-4">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-800">{user.username}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg text-sm">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg text-sm">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">{user.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Services Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4 border-b pb-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg text-white">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold">השירותים שלי</h2>
              <p className="text-xs text-gray-500">השירותים שאתה מציע</p>
            </div>
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              {services.length} שירותים
            </span>
          </div>
          
          {services.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-purple-50 rounded-xl p-6 max-w-md mx-auto">
                <Briefcase className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-4">עדיין לא הוספת שירותים</p>
                <Link href="/services/provide/add">
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                    הוסף שירות חדש
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {services.map(service => (
                <Card key={service.id} className="border-0 shadow-sm overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <h3 className="font-bold text-gray-800">{service.title}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            {service.price}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            service.type === 'local' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {service.type === 'local' ? 'עבודה מקומית' : 'עבודה מרחוק'}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteService(service.id!)}
                        disabled={deleteLoading[service.id!]}
                        className="h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Requests Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4 border-b pb-3">
            <div className="bg-gradient-to-br from-green-500 to-teal-500 p-2 rounded-lg text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold">הבקשות שלי</h2>
              <p className="text-xs text-gray-500">בקשות השירות שפרסמת</p>
            </div>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {requests.length} בקשות
            </span>
          </div>
          
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-green-50 rounded-xl p-6 max-w-md mx-auto">
                <FileText className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-4">עדיין לא הוספת בקשות</p>
                <Link href="/services/request/add">
                  <Button size="sm" className="bg-gradient-to-r from-green-600 to-blue-600">
                    הוסף בקשה חדשה
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {requests.map(request => (
                <Card key={request.id} className="border-0 shadow-sm overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <h3 className="font-bold text-gray-800">{request.title}</h3>
                        <p className="text-sm text-gray-600">{request.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            {request.budget}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.type === 'local' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {request.type === 'local' ? 'עבודה מקומית' : 'עבודה מרחוק'}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteRequest(request.id!)}
                        disabled={deleteLoading[request.id!]}
                        className="h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}