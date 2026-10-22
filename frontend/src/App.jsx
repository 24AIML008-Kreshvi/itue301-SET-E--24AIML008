import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Nav from './components/Nav';
import LoginPage from './pages/LoginPage';
import FleetPage from './pages/FleetPage';
import MyBookingsPage from './pages/MyBookingsPage';
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
export default function App() { return <AuthProvider><BrowserRouter><Nav/><Routes>
 <Route path="/" element={<LoginPage/>}/>
 <Route path="/fleet" element={<ProtectedRoute><FleetPage/></ProtectedRoute>}/>
 <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage/></ProtectedRoute>}/>
 <Route path="/admin" element={<ProtectedRoute><Suspense fallback={<main className="page">Loading admin panel...</main>}><AdminPanel/></Suspense></ProtectedRoute>}/>
 <Route path="*" element={<main className="page">Page not found.</main>}/>
 </Routes><footer>© 2026 DriveEasy · Built for ITUE301 Set E</footer></BrowserRouter></AuthProvider>; }