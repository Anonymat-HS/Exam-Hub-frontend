import { createContext, useState, useCallback, useEffect } from 'react';
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

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'token' || e.key === 'user' || e.key === null) {
        setUser(getInitialUser());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    const loggedUser = { id: data.id, email: data.email, role: data.role };
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
