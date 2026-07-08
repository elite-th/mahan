"use client";

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
// import { ApolloWrapper } from '@/lib/apollo-wrapper';
import ToastContainer from '@/components/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
      <ToastContainer />
    </ToastProvider>
  );
}
