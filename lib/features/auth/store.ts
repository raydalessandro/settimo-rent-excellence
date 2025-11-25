'use client';

/**
 * Feature Auth - Zustand Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/core/storage';
import type { Session, LoginCredentials, RegisterData, AuthResult } from './types';
import { isSessionValid } from './api';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  handleAuthResult: (result: AuthResult) => void;
  logout: () => void;
  checkSession: () => boolean;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setSession: (session) => {
        set({ 
          session,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      handleAuthResult: (result) => {
        if (result.success && result.session) {
          set({
            user: result.user || null,
            session: result.session,
            isAuthenticated: true,
            error: null,
          });
        } else {
          set({
            error: result.error || 'Errore di autenticazione',
          });
        }
      },

      logout: () => {
        set(initialState);
      },

      checkSession: () => {
        const { session } = get();
        const valid = isSessionValid(session);
        
        if (!valid && session) {
          // Sessione scaduta, logout
          set(initialState);
        }
        
        return valid;
      },
    }),
    {
      name: 'rent_excellence_auth',
      version: 1,
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);


