import { createContext, useEffect, useState } from 'react';
import { getToken, setToken, clearToken, parseJwt, isTokenExpired } from '../utils/auth';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

function buildUser(token, role) {
  const payload = parseJwt(token);
  if (!payload) return null;
  return { id: payload.sub ?? payload.id, email: payload.email, role: role ?? payload.role };
}

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('restoring');
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (ignore) return;
      const token = getToken();
      if (!token || isTokenExpired(token)) {
        if (token) clearToken();
        setUser(null);
      } else {
        setUser(buildUser(token));
      }
      setStatus('ready');
    });
    return () => {
      ignore = true;
    };
  }, []);

  async function login(email, password) {
    const data = await authService.login(email, password);
    setToken(data.token);
    const nextUser = buildUser(data.token, data.role);
    setUser(nextUser);
    return nextUser;
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  const value = {
    user,
    role: user?.role ?? null,
    isAuthenticated: Boolean(user),
    isLoading: status === 'restoring',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
