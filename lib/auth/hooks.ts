/**
 * Auth Module - Hooks
 */

import { useAuth } from './store';
import { loginUser, registerUser } from './api';
import type { LoginCredentials, RegisterData } from './types';

export function useAuthActions() {
  const { login, logout } = useAuth();

  const handleLogin = async (credentials: LoginCredentials) => {
    const user = await loginUser(credentials);
    login(user);
    return user;
  };

  const handleRegister = async (data: RegisterData) => {
    const user = await registerUser(data);
    login(user);
    return user;
  };

  const handleLogout = () => {
    logout();
  };

  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}

export function useAuthState() {
  return useAuth();
}

