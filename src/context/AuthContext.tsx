// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { Maestro, UserRole } from "../types/auth";

interface AuthContextType {
  user: Maestro | null;
  token: string | null;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  login: (data: LoginData) => Promise<Maestro>;
  logout: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  cct?: string;
  grado?: string;
  role: UserRole;
}

interface LoginData {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Maestro | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post("http://18.221.245.16:5000/api/maestros/register", data);
      
      // Si el registro es exitoso, hacer login automático
      try {
        await login({ email: data.email, password: data.password });
        return { success: true, message: "Registro exitoso" };
      } catch (loginError) {
        return { success: true, message: "Registro exitoso. Por favor inicia sesión." };
      }
    } catch (error: any) {
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.status === 400) {
        throw new Error("El usuario ya existe");
      } else {
        throw new Error("Error en el servidor. Intenta de nuevo.");
      }
    }
  };

  const login = async (data: LoginData): Promise<Maestro> => {
    try {
      const res = await axios.post("http://18.221.245.16:5000/api/maestros/login", data);
      const { token } = res.data;
      
      setToken(token);
      localStorage.setItem('token', token);

      // Obtener datos del usuario
      const userRes = await axios.get("http://18.221.245.16:5000/api/maestros/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setUser(userRes.data);
      localStorage.setItem('user', JSON.stringify(userRes.data));
      
      return userRes.data;
    } catch (error: any) {
      if (error.response?.data?.msg) {
        throw new Error(error.response.data.msg);
      } else if (error.response?.status === 400) {
        throw new Error("Credenciales inválidas");
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error("Error de conexión con el servidor");
      } else {
        throw new Error("Error al iniciar sesión");
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};