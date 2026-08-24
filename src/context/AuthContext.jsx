import { createContext, useState } from 'react';
import { getToken, setToken, clearToken, parseJwt, isTokenExpired } from '../utils/auth';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

function buildUser(token, apiRole) {
  const p = parseJwt(token);
  if (!p) return null;
  return { id: p.sub ?? p.id, email: p.email, role: apiRole ?? p.role };
}

function readSessionUser() {
  const token = getToken();
  if (!token) return null;
  if (isTokenExpired(token)) { clearToken(); return null; }
  return buildUser(token);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSessionUser);

  async function login(email, password) {
    const data = await authService.login(email, password);
    setToken(data.token);
    const builtUser = buildUser(data.token, data.role);
    setUser(builtUser);
    return builtUser;
  }

  function logout() { clearToken(); setUser(null); }

  return (
    <AuthContext.Provider value={{ user, isLoading: false, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
