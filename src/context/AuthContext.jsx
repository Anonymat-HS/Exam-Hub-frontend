import { createContext, useState, useCallback } from 'react';
import { authService } from '../api/authService';

export const AuthContext = createContext(null);

function getInitialUser() {
  const token = localStorage.getItem('token');
  const stored = localStorage.getItem('user');
  if (token && stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    const profile = data.user;
    const loggedUser = {
      id: profile?.id ?? data.id,
      email: profile?.email ?? data.email,
      role: profile?.role ?? data.role,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading: false, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
