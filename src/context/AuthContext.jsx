import { createContext, useContext, useState, useEffect } from 'react';
import { getUserByEmail, createUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const stored = localStorage.getItem('moda_usuario');
    if (stored) {
      try { setUsuario(JSON.parse(stored)); } catch {  }
    }
    setLoading(false);
  }, []);

  
  const login = async (correo, password) => {
    const users = await getUserByEmail(correo);
    const found = users.find((u) => u.password === password);
    if (!found) throw new Error('Correo o contraseña incorrectos');
    const { password: _pw, ...safe } = found;
    setUsuario(safe);
    localStorage.setItem('moda_usuario', JSON.stringify(safe));
    return safe;
  };

  
  const register = async (nombre, correo, password) => {
    
    const existing = await getUserByEmail(correo);
    if (existing.length > 0) throw new Error('Este correo ya está registrado');

    const newUser = {
      nombre,
      correo,
      password,
      rol: 'cliente',
      createdAt: new Date().toISOString(),
    };
    
    const created = await createUser(newUser);
    const { password: _pw, ...safe } = created;
    setUsuario(safe);
    localStorage.setItem('moda_usuario', JSON.stringify(safe));
    return safe;
  };

  
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('moda_usuario');
  };

  const isLoggedIn = !!usuario;
  const isAdmin = usuario?.rol === 'admin';

  return (
    <AuthContext.Provider value={{ usuario, isLoggedIn, isAdmin, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
