import { createContext, useContext, useEffect, useState } from 'react';
import staffApi, { setAuthToken } from './staffApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('tra_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthToken(token);
    staffApi.get('/auth/me')
      .then((r) => setUser(r.data))
      .catch(() => {
        localStorage.removeItem('tra_token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (username, password) => {
    const { data } = await staffApi.post('/auth/login', { username, password });
    localStorage.setItem('tra_token', data.token);
    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('tra_token');
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
