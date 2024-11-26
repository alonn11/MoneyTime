"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import AddRequestPage from '@/components/pages/AddRequestPage';

export default function AddRequest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-3xl"></div>
          <div className="relative p-6">
            <AddRequestPage />
          </div>
        </div>
      </div>
    </div>
  );
}