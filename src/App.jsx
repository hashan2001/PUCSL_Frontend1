import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Public Pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import ProviderRegistration from './pages/ProviderRegistration.jsx';
import ProviderProfile from './pages/ProviderProfile.jsx';
import Search from './pages/Search.jsx';

// Admin Pages
import AddProvider from './pages/Admin/AddProvider.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import ProviderManagement from './pages/Admin/ProviderManagement.jsx';

// Provider Pages
import ProviderDashboard from './pages/Provider/ProviderDashboard.jsx';
import EditProfile from './pages/Provider/EditProfile.jsx';

function App() {
  return (
    <>
      <Navigation />
      <div className="app-content">
        <Routes>
          {/* ==================== PUBLIC ROUTES ==================== */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<ProviderRegistration />} />
          <Route path="/search" element={<Search />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />

          {/* ==================== ADMIN ONLY ROUTES ==================== */}
          <Route 
            path="/admindashboard" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/addprovider" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AddProvider />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/providermanagement" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ProviderManagement />
              </ProtectedRoute>
            } 
          />

          {/* ==================== PROVIDER ONLY ROUTES ==================== */}
          <Route 
            path="/providerdashboard" 
            element={
              <ProtectedRoute allowedRoles={['PROVIDER']}>
                <ProviderDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/provider/editprofile" 
            element={
              <ProtectedRoute allowedRoles={['PROVIDER']}>
                <EditProfile />
              </ProtectedRoute>
            } 
          />

          {/* ==================== FALLBACK ROUTE ==================== */}
          {/* Redirects unknown pages back to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;