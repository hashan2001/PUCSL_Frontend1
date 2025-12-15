import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import ProviderRegistration from './pages/ProviderRegistration.jsx';
import ProviderProfile from './pages/ProviderProfile.jsx';
import Search from './pages/Search.jsx';
import AddProvider from './pages/Admin/AddProvider.jsx';
import  AdminDashboard  from './pages/Admin/AdminDashboard.jsx';

import  ProviderDashboard  from './pages/Provider/ProviderDashboard.jsx';
import EditProfile from './pages/Provider/EditProfile.jsx';
import ProviderManagement from './pages/Admin/ProviderManagement.jsx';

function App() {
  return (
    <>
      <Navigation />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<ProviderRegistration />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
          <Route path="/search" element={<Search/>} />
          <Route path="/addprovider" element={<AddProvider/>} />
          
          <Route path="/admindashboard" element={<AdminDashboard/>} />
          <Route path="/providerdashboard" element={<ProviderDashboard/>} />
          <Route path="/provider/editprofile" element={<EditProfile/>} />
          <Route path="/providermanagement" element={<ProviderManagement/>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
