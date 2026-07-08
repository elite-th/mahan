"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './ToastContext';

// Promise-based refresh lock — shared across all concurrent 401 responses.
// When multiple API calls return 401 simultaneously, they all await the same
// refresh promise instead of each triggering a separate refresh or silently
// failing because "another refresh is in progress".
let refreshPromise: Promise<boolean> | null = null;

// Auth uses httpOnly cookies for session management.
// The backend API routes (/api/auth/*) handle cookie setting/clearing.
// Client-side code never accesses the token directly — the /api/graphql
// proxy reads the httpOnly cookie and forwards it as an Authorization header.

interface User {
  id: string;
  email: string;
  nicename: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextProps {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  login: (username: string, password: string, redirectUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // For checking session initially
  const [isLoggingIn, setIsLoggingIn] = useState(false); // For the login action itself
  const router = useRouter();
  const { showToast } = useToast();

  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // On mount, check if the user has an active session via httpOnly cookie
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are sent
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
        // If not ok (401, etc.), user stays null — not logged in
      } catch (e) {
        console.error("Failed to check auth session", e);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkSession();
  }, []);

  // Periodic token refresh — every 30 minutes when logged in
  useEffect(() => {
    if (user) {
      // Start refresh interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      refreshIntervalRef.current = setInterval(() => {
        if (refreshPromise) return; // A refresh is already in progress
        refreshPromise = fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })
          .then(r => {
            if (!r.ok) {
              console.warn('Periodic token refresh failed — session may be expired');
            }
            return r.ok;
          })
          .catch(() => false as const)
          .finally(() => { refreshPromise = null; });
      }, 30 * 60 * 1000); // 30 minutes
    } else {
      // Clear interval when logged out
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [user]);

  const login = useCallback(async (username: string, password: string, redirectUrl?: string) => {
    setIsLoggingIn(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensure cookies are sent/received
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // The API returns error in data.error or data.message
        const rawMessage = data.error || data.message || '';
        const message = rawMessage ? rawMessage.replace(/<[^>]*>/g, '') : 'نام کاربری یا رمز عبور اشتباه است.';
        throw new Error(message);
      }

      const loggedInUser: User = {
        id: String(data.user?.id ?? ''),
        email: data.user?.email || '',
        nicename: data.user?.nicename || '',
        displayName: data.user?.displayName || '',
      };

      setUser(loggedInUser);
      showToast(`خوش آمدید, ${loggedInUser.displayName}!`, 'success');
      router.push(redirectUrl || '/account');
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'خطای ناشناخته', 'error');
      throw error; // Re-throw for the component to handle
    } finally {
      setIsLoggingIn(false);
    }
  }, [router, showToast]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error("Failed to call logout endpoint", e);
    }
    setUser(null);
    showToast('با موفقیت خارج شدید.', 'info');
    router.push('/');
  }, [router, showToast]);

  /**
   * Auth-aware fetch utility.
   *
   * Wraps the standard `fetch` with automatic 401 handling:
   * 1. Makes the initial request
   * 2. If the response is 401, attempts a token refresh via /api/auth/refresh
   * 3. On successful refresh, retries the original request once
   * 4. On failed refresh, clears user state (forces re-login)
   *
   * Uses a promise-based refresh lock so that multiple concurrent 401 responses
   * all await the same refresh attempt instead of silently failing.
   */
  const authFetch = useCallback(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const response = await fetch(input, { ...init, credentials: 'include' });

    if (response.status === 401) {
      if (!refreshPromise) {
        refreshPromise = fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
          .then(r => r.ok)
          .finally(() => { refreshPromise = null; });
      }
      const refreshed = await refreshPromise;
      if (refreshed) {
        return fetch(input, { ...init, credentials: 'include' });
      }
      setUser(null);
    }

    return response;
  }, []);

  const contextValue = React.useMemo(() => ({
    isLoggedIn: !!user,
    isLoading: isAuthLoading || isLoggingIn,
    user,
    login,
    logout,
    authFetch,
  }), [user, isAuthLoading, isLoggingIn, login, logout, authFetch]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
