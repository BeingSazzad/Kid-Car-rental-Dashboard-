import { useState, useEffect } from 'react';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const DEFAULT_ADMIN: AdminUser = {
  id: 'adm-001',
  name: 'Super Admin',
  email: 'admin@home2school.ca',
  role: 'Master Administrator',
  avatar: 'SA',
};

const AUTH_KEY = 'h2s_admin_session';

export function getStoredAuth(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(AUTH_KEY);
  return stored !== 'false'; // default logged in, set to 'false' upon logout
}

export function setStoredAuth(val: boolean) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, val ? 'true' : 'false');
    window.dispatchEvent(new Event('auth_state_changed'));
  }
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getStoredAuth());
  const [user] = useState<AdminUser>(DEFAULT_ADMIN);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(getStoredAuth());
    };
    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, []);

  const login = (email: string, pass: string): boolean => {
    if (email.trim() && pass.trim()) {
      setStoredAuth(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setStoredAuth(false);
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
}
