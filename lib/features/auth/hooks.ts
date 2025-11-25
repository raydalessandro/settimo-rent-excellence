'use client';

/**
 * Feature Auth - React Hooks
 */

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useUserStorage } from '@/lib/core/storage';
import { useAuthStore } from './store';
import { login, register, logout as logoutApi, refreshSession } from './api';
import type { LoginCredentials, RegisterData } from './types';

/**
 * Hook per stato auth
 */
export function useAuth() {
  const store = useAuthStore();

  return {
    user: store.user,
    session: store.session,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
  };
}

/**
 * Hook per user corrente
 */
export function useUser() {
  return useAuthStore(state => state.user);
}

/**
 * Hook per verificare autenticazione
 */
export function useIsAuthenticated() {
  return useAuthStore(state => state.isAuthenticated);
}

/**
 * Hook per login
 */
export function useLogin() {
  const storage = useUserStorage();
  const { handleAuthResult, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      setLoading(true);
      setError(null);
      return login(storage, credentials);
    },
    onSuccess: (result) => {
      handleAuthResult(result);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

/**
 * Hook per registrazione
 */
export function useRegister() {
  const storage = useUserStorage();
  const { handleAuthResult, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      setLoading(true);
      setError(null);
      return register(storage, data);
    },
    onSuccess: (result) => {
      handleAuthResult(result);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

/**
 * Hook per logout
 */
export function useLogout() {
  const { logout: storeLogout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await logoutApi();
    },
    onSuccess: () => {
      storeLogout();
      router.push('/');
    },
  });
}

/**
 * Hook per refresh sessione
 */
export function useRefreshSession() {
  const storage = useUserStorage();
  const session = useAuthStore(state => state.session);
  const { handleAuthResult } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (!session) throw new Error('No session');
      return refreshSession(storage, session);
    },
    onSuccess: (result) => {
      handleAuthResult(result);
    },
  });
}

/**
 * Hook per proteggere route
 */
export function useRequireAuth(redirectTo: string = '/login') {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const checkSession = useAuthStore(state => state.checkSession);

  useEffect(() => {
    const valid = checkSession();
    if (!valid) {
      router.push(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [isAuthenticated, checkSession, router, redirectTo]);

  return isAuthenticated;
}

/**
 * Hook per redirect se già autenticato
 */
export function useRedirectIfAuthenticated(redirectTo: string = '/') {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);
}

/**
 * Hook per azioni auth
 */
export function useAuthActions() {
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}


