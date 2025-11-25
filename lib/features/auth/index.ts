/**
 * Feature Auth - Public Exports
 */

// Types
export type {
  User,
  CreateUserData,
  LoginCredentials,
  RegisterData,
  Session,
  AuthState,
  AuthResult,
} from './types';

// API
export {
  login,
  register,
  logout,
  isSessionValid,
  refreshSession,
} from './api';

// Store
export { useAuthStore } from './store';

// Hooks
export {
  useAuth,
  useUser,
  useIsAuthenticated,
  useLogin,
  useRegister,
  useLogout,
  useRefreshSession,
  useRequireAuth,
  useRedirectIfAuthenticated,
  useAuthActions,
} from './hooks';


