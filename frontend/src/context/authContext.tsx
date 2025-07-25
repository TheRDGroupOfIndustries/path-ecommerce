// import React, { createContext, useContext, useState, useEffect } from 'react';
// import type { ReactNode } from 'react';
// import axios from 'axios';

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   picture?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (token: string) => void;
//   logout: () => void;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkAuth();
//   }, []);
//   const checkAuth = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       console.log('CheckAuth - Token:', token ? 'exists' : 'not found');
      
//       if (!token) {
//         console.log('No token found, setting loading to false');
//         setLoading(false);
//         return;
//       }

//       console.log('Making request to /api/auth/me');
//       const response = await axios.get(`/api/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       console.log('Auth response:', response.data);
//       setUser(response.data.user);
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       localStorage.removeItem('token');
//       setUser(null);
//     } finally {
//       console.log('Setting loading to false');
//       setLoading(false);
//     }
//   };

//   const login = (token: string) => {
//     localStorage.setItem('token', token);
//     checkAuth();
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   const value: AuthContextType = {
//     user,
//     login,
//     logout,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };




import React, { createContext, useContext, useState, useEffect } from "react";
import { authservices } from "../services/authservice";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  imageUrl?: string;
  phone?: string;
  referralCode?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
      
  register: (data: { name: string; email: string; password: string,confirmPassword:string, referralCode:string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    try {
      const res = await authservices.me(token);
      // console.log("Me authservice: ",res);
      setUser(res.user);
      
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await authservices.login({ email, password });
    // console.log("login authservice1: ",res.token);
    localStorage.setItem("token", res.token.accessToken);
    setUser(res.user);
  };

  const register = async (data: { name: string; email: string; password: string,confirmPassword:string }) => {
    const res = await authservices.register(data);
    localStorage.setItem("token", res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading,setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
