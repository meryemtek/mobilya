import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../api/endpoints';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  loading: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bm_auth_token');
    const storedEmail = localStorage.getItem('bm_auth_email');

    if (token && storedEmail) {
      setUser({ email: storedEmail });
      // Token geçerliliğini arka planda teyit et
      adminApi.getMe()
        .then((res) => {
          setUser({ email: res.email });
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token: string, email: string) => {
    localStorage.setItem('bm_auth_token', token);
    localStorage.setItem('bm_auth_email', email);
    setUser({ email });
  };

  const logout = () => {
    localStorage.removeItem('bm_auth_token');
    localStorage.removeItem('bm_auth_email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
