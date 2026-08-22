import { createContext, useState } from 'react';
import { getToken, setToken, clearToken, parseJwt, isTokenExpired } from '../utils/auth';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

function buildUser(token) {
  const p = parseJwt(token);
  return p ? { id: p.sub ?? p.id, email: p.email, role: p.role } : null;
}

function readSessionUser() {
  const token = getToken();
  if (!token) return null;
  if (isTokenExpired(token)) return null;
  return buildUser(token);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSessionUser);

  async function login(email, password) {
    const data = await authService.login(email, password);
    setToken(data.token);
    setUser(buildUser(data.token));
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
