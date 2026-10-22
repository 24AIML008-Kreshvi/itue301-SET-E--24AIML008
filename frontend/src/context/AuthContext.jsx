import { createContext, useContext, useState } from 'react';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
 const [auth, setAuth] = useState(() => {
  try { return JSON.parse(sessionStorage.getItem('driveeasy_auth')) || { customer: null, token: null }; }
  catch { return { customer: null, token: null }; }
 });
 function login(data) { const value = { customer: data.customer, token: data.token }; sessionStorage.setItem('driveeasy_auth', JSON.stringify(value)); setAuth(value); }
 function logout() { sessionStorage.removeItem('driveeasy_auth'); setAuth({ customer: null, token: null }); }
 return <AuthContext.Provider value={{ ...auth, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }