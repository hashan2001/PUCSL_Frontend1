import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Wrench, Wind, Zap, Shield, Star, MapPin, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';
import '../Style/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // 🔹 ADD THIS — provider count state
  const [providerCounts, setProviderCounts] = useState({
    AC: 0,
    RAC: 0,
    Electrician: 0,
  });

  // 🔹 ADD THIS — fetch verified providers from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/users/providers/verified")
      .then((res) => res.json())
      .then((data) => {
        const counts = { AC: 0, RAC: 0, Electrician: 0 };

        data.forEach((provider) => {
          const type = provider.serviceType;
          if (counts[type] !== undefined) {
            counts[type]++;
          }
        });

        setProviderCounts(counts);
      })
      .catch((err) => console.error("Provider fetch error:", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/search?category=${category}`);
  };

  // 🔹 UPDATED — dynamic provider count
  const categories = [
    {
      type: 'AC',
      icon: Wind,
      title: 'Air Conditioning',
      description: 'Professional AC installation, repair, and maintenance services',
      colorClass: 'category-blue',
      providers: providerCounts.AC,
      rating: 4.8,
    },
    {
      type: 'RAC',
      icon: Wrench,
      title: 'Refrigerator & Air Conditioning',
      description: 'Expert RAC installation and servicing for your comfort',
      colorClass: 'category-cyan',
      providers: providerCounts.RAC,
      rating: 4.6,
    },
    {
      type: 'Electrician',
      icon: Zap,
      title: 'Electrician',
      description: 'Licensed electrical installation and repair services',
      colorClass: 'category-yellow',
      providers: providerCounts.Electrician,
      rating: 4.9,
    },
  ];

  return (
    <div className="home-wrapper">
      <div className="home-container">
        {/* Header */}
        <div className="home-header">
          <div className="icon-wrap">
            <img src={logo} alt="PUCSL Logo" className="logo-image" />
          </div>
          <h1>PUCSL Service Provider Marketplace</h1>
          <p>
            Find verified and trusted service providers for all your electrical and cooling needs.
            All providers are certified by the Public Utilities Commission of Sri Lanka.
          </p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search for service providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <Search className="search-icon" />
              </button>
            </div>
          </form>
        </div>

        {/* Categories */}
        <div className="section">
          <h2 className="section-title">Service Categories</h2>
          <div className="category-grid">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.type}
                  className="category-card hover-lift"
                  onClick={() => handleCategoryClick(category.type)}
                >
                  <div className={`category-icon ${category.colorClass}`}>
                    <Icon className="icon-medium" />
                  </div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <div className="category-stats">
                    <span className="provider-count">{category.providers} providers</span>
                    <span className="rating">★ {category.rating}</span>
                  </div>
                  <ArrowRight className="arrow-icon" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlights */}
        <div className="highlights">
          <div className="highlight-grid">
            <div className="animate-fade-in-up animate-delay-1">
              <Shield className="highlight-icon" />
              <h3>PUCSL Verified</h3>
              <p>All providers are verified for your safety</p>
            </div>
            <div className="animate-fade-in-up animate-delay-2">
              <Star className="highlight-icon" />
              <h3>Rated Services</h3>
              <p>Read reviews from real customers before choosing</p>
            </div>
            <div className="animate-fade-in-up animate-delay-3">
              <MapPin className="highlight-icon" />
              <h3>Location Based</h3>
              <p>Find the nearest providers in your district</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="how-section">
          <h2>How It Works</h2>
          <div className="how-grid">
            {['Search', 'Compare', 'Contact', 'Review'].map((step, index) => (
              <div key={index} className="how-card animate-fade-in-up animate-delay-1">
                <div className="how-step">{index + 1}</div>
                <h3>{step}</h3>
                <p>
                  {index === 0 && 'Browse or search for the service you need'}
                  {index === 1 && 'Check ratings, reviews, and locations'}
                  {index === 2 && 'Request service directly from providers'}
                  {index === 3 && 'Share your experience to help others'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
