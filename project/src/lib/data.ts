import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export interface ServiceProvider {
  uid: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  verified: boolean;
}

export interface ServiceRequester {
  uid: string;
  name: string;
  email: string;
  phone: string;
  image: string;
}

export interface Service {
  id?: string;
  title: string;
  description: string;
  keywords: string[];
  price: string;
  type: 'local' | 'remote';
  distance?: string;
  availability: string;
  provider: ServiceProvider;
  createdAt: Timestamp;
  location?: string;
}

export interface ServiceRequest {
  id?: string;
  title: string;
  description: string;
  keywords: string[];
  budget: string;
  type: 'local' | 'remote';
  location?: string;
  requester: ServiceRequester;
  createdAt: Timestamp;
  status: 'open' | 'in-progress' | 'completed';
}

export const addService = async (serviceData: Omit<Service, 'id' | 'createdAt'>) => {
  try {
    if (!serviceData.title?.trim()) throw new Error('Title is required');
    if (!serviceData.description?.trim()) throw new Error('Description is required');
    if (!serviceData.provider?.uid) throw new Error('Provider is required');
    if (!serviceData.type) throw new Error('Service type is required');
    if (!serviceData.price) throw new Error('Price is required');

    const cleanData = {
      title: serviceData.title.trim(),
      description: serviceData.description.trim(),
      keywords: Array.isArray(serviceData.keywords) ? 
        serviceData.keywords.map(k => k.trim()).filter(Boolean) : [],
      price: serviceData.price,
      type: serviceData.type,
      availability: serviceData.availability || 'זמין',
      provider: {
        uid: serviceData.provider.uid,
        name: serviceData.provider.name,
        email: serviceData.provider.email,
        phone: serviceData.provider.phone,
        image: serviceData.provider.image,
        verified: true
      },
      createdAt: Timestamp.now()
    };

    if (serviceData.type === 'local' && serviceData.location) {
      cleanData.location = serviceData.location.trim();
    }

    const docRef = await addDoc(collection(db, 'services'), cleanData);
    
    return {
      id: docRef.id,
      ...cleanData,
      createdAt: cleanData.createdAt
    };
  } catch (error) {
    console.error('Error adding service:', error);
    throw error;
  }
};

export const addServiceRequest = async (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => {
  try {
    if (!requestData.title?.trim()) throw new Error('Title is required');
    if (!requestData.description?.trim()) throw new Error('Description is required');
    if (!requestData.requester?.uid) throw new Error('Requester is required');
    if (!requestData.type) throw new Error('Request type is required');
    if (!requestData.budget) throw new Error('Budget is required');

    const cleanData = {
      title: requestData.title.trim(),
      description: requestData.description.trim(),
      keywords: Array.isArray(requestData.keywords) ? 
        requestData.keywords.map(k => k.trim()).filter(Boolean) : [],
      budget: requestData.budget,
      type: requestData.type,
      requester: {
        uid: requestData.requester.uid,
        name: requestData.requester.name,
        email: requestData.requester.email,
        phone: requestData.requester.phone,
        image: requestData.requester.image
      },
      createdAt: Timestamp.now(),
      status: 'open' as const
    };

    if (requestData.type === 'local' && requestData.location) {
      cleanData.location = requestData.location.trim();
    }

    const docRef = await addDoc(collection(db, 'service-requests'), cleanData);
    
    return {
      id: docRef.id,
      ...cleanData,
      createdAt: cleanData.createdAt
    };
  } catch (error) {
    console.error('Error adding service request:', error);
    throw error;
  }
};

export const getServices = async (userId?: string) => {
  try {
    let servicesQuery;
    
    if (userId) {
      servicesQuery = query(
        collection(db, 'services'),
        where('provider.uid', '==', userId),
        orderBy('createdAt', 'desc')
      );
    } else {
      servicesQuery = query(
        collection(db, 'services'),
        orderBy('createdAt', 'desc')
      );
    }
    
    const snapshot = await getDocs(servicesQuery);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt
      } as Service;
    });
  } catch (error) {
    console.error('Error getting services:', error);
    throw error;
  }
};

export const getServiceRequests = async (userId?: string) => {
  try {
    let requestsQuery;
    
    if (userId) {
      requestsQuery = query(
        collection(db, 'service-requests'),
        where('requester.uid', '==', userId),
        orderBy('createdAt', 'desc')
      );
    } else {
      requestsQuery = query(
        collection(db, 'service-requests'),
        orderBy('createdAt', 'desc')
      );
    }
    
    const snapshot = await getDocs(requestsQuery);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt
      } as ServiceRequest;
    });
  } catch (error) {
    console.error('Error getting service requests:', error);
    throw error;
  }
};