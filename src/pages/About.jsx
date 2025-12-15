import React from 'react';
import { Shield, CheckCircle, Users, Award } from 'lucide-react';
import '../Style/About.css';

const About = () => {
  return (
    <div className="about-wrapper">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-container">
          <Shield className="about-icon" />
          <h1 className="about-title">About PUCSL Service Provider Marketplace</h1>
          <p className="about-subtitle">
            Your trusted platform for finding verified electrical and cooling service providers across Sri Lanka.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-content">
        <div className="about-box">
          <h2 className="section-heading">Our Mission</h2>
          <p>
            The PUCSL Service Provider Marketplace is an initiative by the Public Utilities Commission of Sri Lanka 
            to connect consumers with verified, licensed, and trusted service providers in the electrical and cooling services sector.
          </p>
          <p>
            We aim to ensure quality, safety, and reliability in service delivery by maintaining a verified database 
            of service providers who meet PUCSL standards and regulations.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="about-grid">
          <div className="about-card">
            <div className="icon-box blue"><Shield className="icon-medium" /></div>
            <h3>PUCSL Verified</h3>
            <p>Every service provider on our platform has been verified and approved by PUCSL, ensuring they meet regulatory standards.</p>
          </div>

          <div className="about-card">
            <div className="icon-box blue"><CheckCircle className="icon-medium" /></div>
            <h3>Quality Assurance</h3>
            <p>We continuously monitor providers through customer feedback to maintain high service standards.</p>
          </div>

          <div className="about-card">
            <div className="icon-box blue"><Users className="icon-medium" /></div>
            <h3>Consumer Protection</h3>
            <p>Our platform ensures transparency with detailed provider profiles, reviews, and contact info.</p>
          </div>

          <div className="about-card">
            <div className="icon-box blue"><Award className="icon-medium" /></div>
            <h3>Industry Standards</h3>
            <p>All providers follow PUCSL regulations and best practices to deliver safe and professional services.</p>
          </div>
        </div>

        {/* Services Section */}
        <div className="about-box">
          <h2 className="section-heading">Services Covered</h2>
          <div className="service-item">
            <h4>Air Conditioning (AC)</h4>
            <p>Installation, repair, maintenance, and servicing of commercial and residential central air conditioning systems.</p>
          </div>
          <div className="service-item">
            <h4>Room Air Conditioner (RAC)</h4>
            <p>Installation, repair, and maintenance of split, window, and portable air conditioning units.</p>
          </div>
          <div className="service-item">
            <h4>Electrician Services</h4>
            <p>Electrical installations, wiring, lighting, circuit breaker setup, and safety inspections.</p>
          </div>
        </div>

        {/* Trust & Safety */}
        <div className="trust-box">
          <h2 className="section-heading">Trust & Safety</h2>
          <p>
            The PUCSL Service Provider Marketplace is committed to maintaining the highest standards of trust and safety. 
            All service providers undergo a thorough verification process before being listed on the platform.
          </p>
          <ul>
            <li><CheckCircle className="check-icon" /> License verification and validation</li>
            <li><CheckCircle className="check-icon" /> Regular compliance monitoring</li>
            <li><CheckCircle className="check-icon" /> Customer feedback and rating system</li>
            <li><CheckCircle className="check-icon" /> Immediate suspension for non-compliance</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default About;
