"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Product, CartItemType } from '../types';
import { useToast } from './ToastContext';
import { signPrice, verifyPrice } from '@/lib/cart-integrity';

interface CartContextProps {
  cartItems: CartItemType[];
  isHydrated: boolean;
  addToCart: (product: Product | { id: string; name: string; price: number; imageUrl: string; slug: string }, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  // Always initialize with empty array to match server-rendered HTML and avoid hydration mismatch.
  // Cart items from localStorage are loaded in useEffect below (client-only).
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage after hydration (client-only)
  useEffect(() => {
    try {
      const localData = localStorage.getItem('viraCart');
      if (localData) {
        const parsedData = JSON.parse(localData);
        if (Array.isArray(parsedData)) {
          const validatedItems = parsedData.filter((item: unknown): item is CartItemType => {
            if (!item || typeof item !== 'object') return false;
            const record = item as Record<string, unknown>;
            if (!('id' in record) || typeof record.id !== 'string') return false;
            if (!('price' in record) || typeof record.price !== 'number') return false;

            // Verify price integrity hash — detects accidental or malicious price tampering in localStorage
            if (record.priceHash && typeof record.id === 'string' && typeof record.price === 'number' && !verifyPrice(record.id, record.price, record.priceHash as string)) {
              console.warn('Price integrity check failed for cart item, removing:', record.id);
              return false;
            }

            if (typeof record.price === 'number') {
              if (record.price < 100 && record.price > 0) {
                console.warn('Found suspicious price in cart, removing item:', record.id);
                return false;
              }
            }
            return true;
          });
          setCartItems(validatedItems);
        }
      }
    } catch (error) {
      console.error("Error reading or parsing cart from localStorage", error);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('viraCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = useCallback((product: Product | { id: string; name: string; price: number; imageUrl: string; slug: string }, quantityToAdd: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      }
      return [...prevItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantityToAdd,
        slug: product.slug,
        priceHash: signPrice(product.id, product.price)
      }];
    });
    showToast(`${product.name} به سبد خرید اضافه شد!`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    showToast('محصول از سبد خرید حذف شد.', 'info');
  }, [showToast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    showToast('سبد خرید خالی شد.', 'info');
  }, [showToast]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }, [cartItems]);

  const getItemCount = useCallback(() => {
    return cartItems.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0);
  }, [cartItems]);

  const contextValue = React.useMemo(() => ({
    cartItems,
    isHydrated,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount
  }), [cartItems, isHydrated, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};