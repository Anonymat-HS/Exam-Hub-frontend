import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

const MOCK_USER = { id: '1', email: 'admin@examhub.com', role: 'ADMIN' };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER);

  async function login() { return user; }
  function logout() { setUser(null); }

  return (
    <AuthContext.Provider value={{ user, isLoading: false, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
