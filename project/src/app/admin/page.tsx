"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Service, ServiceRequest } from '@/lib/data';
import { Home, Users, Briefcase, FileText, Trash2, Mail, Phone } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/services');
      return;
    }

    const fetchData = async () => {
      try {
        const servicesSnapshot = await getDocs(collection(db, 'services'));
        const servicesData = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        setServices(servicesData);

        const requestsSnapshot = await getDocs(collection(db, 'service-requests'));
        const requestsData = requestsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ServiceRequest[];
        setRequests(requestsData);

        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.isAdmin) {
      fetchData();
    }
  }, [user, loading, router]);

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteDoc(doc(db, 'services', serviceId));
      setServices(services.filter(service => service.id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      await deleteDoc(doc(db, 'service-requests', requestId));
      setRequests(requests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
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

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/services"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors bg-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg"
        >
          <Home className="w-5 h-5" />
          <span>חזרה לדף הבית</span>
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ניהול האתר
        </h1>
      </div>

      <div className="grid gap-8">
        {/* Users Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl text-white">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">משתמשים</h2>
              <p className="text-sm text-gray-500">ניהול משתמשי המערכת</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full font-medium">
              {users.length} משתמשים
            </span>
          </div>
          
          <div className="grid gap-4">
            {users.map(user => (
              <Card key={user.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-800">{user.username}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {user.phone}
                        </div>
                      </div>
                      {user.isAdmin && (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          מנהל מערכת
                        </span>
                      )}
                    </div>
                    {!user.isAdmin && (
                      <Button 
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        className="shrink-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl text-white">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">שירותים</h2>
              <p className="text-sm text-gray-500">ניהול שירותים מוצעים</p>
            </div>
            <span className="bg-purple-100 text-purple-800 text-sm px-4 py-2 rounded-full font-medium">
              {services.length} שירותים
            </span>
          </div>
          
          <div className="grid gap-4">
            {services.map(service => (
              <Card key={service.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                      <p className="text-gray-600">{service.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {service.price}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          service.type === 'local' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {service.type === 'local' ? 'עבודה מקומית' : 'עבודה מרחוק'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">{service.provider.name}</span>
                        <span>•</span>
                        <span>{service.provider.email}</span>
                      </div>
                    </div>
                    <Button 
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteService(service.id)}
                      className="shrink-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Requests Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="bg-gradient-to-br from-green-500 to-teal-500 p-3 rounded-xl text-white">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">בקשות שירות</h2>
              <p className="text-sm text-gray-500">ניהול בקשות שירות</p>
            </div>
            <span className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full font-medium">
              {requests.length} בקשות
            </span>
          </div>
          
          <div className="grid gap-4">
            {requests.map(request => (
              <Card key={request.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{request.title}</h3>
                      <p className="text-gray-600">{request.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {request.budget}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.type === 'local' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {request.type === 'local' ? 'עבודה מקומית' : 'עבודה מרחוק'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">{request.requester.name}</span>
                        <span>•</span>
                        <span>{request.requester.email}</span>
                      </div>
                    </div>
                    <Button 
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteRequest(request.id)}
                      className="shrink-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}