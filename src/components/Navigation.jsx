import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, Home, Info, Search, Phone, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import logo from '../assets/logo.png';
import '../Style/Navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const type = localStorage.getItem('userType');
    const name = localStorage.getItem('userName');
    setUserType(type);
    setUserName(name);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/search', label: 'Find Providers', icon: Search },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  const adminItems = [
    { path: '/admindashboard', label: 'Dashboard', icon: Shield },
    { path: '/addprovider', label: 'Add Provider', icon: UserPlus },
  ];

  const providerItems = [
    { path: '/providerdashboard', label: 'Dashboard', icon: User },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    setUserType(null);
    setUserName('');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <img src={logo} alt="PUCSL Logo" className="nav-logo-image" />
          <span className="logo-text">PUCSL</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          {userType === 'admin' && adminItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          {userType === 'provider' && providerItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div className="nav-auth">
          {userType ? (
            <>
              <span className="user-greeting">
                {userType === 'admin' ? 'Admin' : userName}
              </span>
              <button onClick={handleLogout} className="auth-btn logout-btn">
                <LogOut className="auth-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="auth-btn login-btn">
              <LogIn className="auth-icon" />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-toggle" onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-nav-items">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="mobile-nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          {userType === 'admin' && adminItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="mobile-nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          {userType === 'provider' && providerItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="mobile-nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="mobile-divider"></div>
          {userType ? (
            <>
              <div className="mobile-user-info">
                <span>{userType === 'admin' ? 'Admin' : userName}</span>
              </div>
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="mobile-nav-link logout-link"
              >
                <LogOut className="mobile-nav-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="mobile-nav-link auth-link"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="mobile-nav-icon" />
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
