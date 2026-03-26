import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Simple JWT payload decoder (no lib needed — just base64)
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('hl_token'));

  // Restore user from token on mount
  useEffect(() => {
    const stored = localStorage.getItem('hl_token');
    const storedUser = localStorage.getItem('hl_user');
    if (stored && storedUser) {
      try {
        // Verify token isn't expired
        const decoded = decodeToken(stored);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setToken(stored);
          setUser(JSON.parse(storedUser));
        } else {
          // Expired — clear
          localStorage.removeItem('hl_token');
          localStorage.removeItem('hl_user');
        }
      } catch {
        localStorage.removeItem('hl_token');
        localStorage.removeItem('hl_user');
      }
    }
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem('hl_token', newToken);
    localStorage.setItem('hl_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const updateUser = (userData) => {
    localStorage.setItem('hl_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('hl_token');
    localStorage.removeItem('hl_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
