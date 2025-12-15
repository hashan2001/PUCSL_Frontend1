import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../style/Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            
            {/* Company Info */}
            <div className="footer-section">
              <div className="footer-logo">
                <div>
                  <span className="footer-logo-text">PUCSL</span><br />
                  <span className="footer-logo-subtext">Marketplace</span>
                </div>
              </div>
              <p className="footer-desc">
                Public Utilities Commission of Sri Lanka - Your trusted platform for finding verified
                service providers in electrical and cooling services.
              </p>
              <div className="footer-socials">
                <a href="https://www.facebook.com/share/1BxFk8fHoK/" target="_blank" rel="noopener noreferrer" className="social-btn fb"><Facebook /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-btn tw"><Twitter /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-btn ln"><Linkedin /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/search', label: 'Find Providers' },
                  { to: '/about', label: 'About PUCSL' },
                  { to: '/contact', label: 'Contact Us' },
                  { to: '/login', label: 'Login' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="footer-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="footer-section">
              <h3 className="footer-title">Services</h3>
              <ul className="footer-links">
                {[
                  { to: '/search?category=AC', label: 'Air Conditioning' },
                  { to: '/search?category=RAC', label: 'Refrigetor & Air Conditioning' },
                  { to: '/search?category=Electrician', label: 'Electrician Services' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="footer-link">{label}</Link>
                  </li>
                ))}
                <li><a href="#" className="footer-link">Provider Registration</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h3 className="footer-title">Contact Info</h3>
              <ul className="footer-contact">
                <li><MapPin /><span>6th Floor, BOC Merchant Tower<br />No. 28, St. Michael's Road<br />Colombo 03, Sri Lanka</span></li>
                <li><Phone /><span>+94 11 2 636426</span></li>
                <li><Mail /><span>info@pucsl.gov.lk</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="footer-bottom">
            <p>© {currentYear} Public Utilities Commission of Sri Lanka. All rights reserved.</p>
            <div className="footer-policies">
              {[
                { href: '#', label: 'Privacy Policy' },
                { href: '#', label: 'Terms of Service' },
                { href: '#', label: 'Cookie Policy' },
              ].map(({ href, label }) => (
                <a key={label} href={href}>{label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-top">
          <ArrowUp />
        </button>
      )}
    </>
  );
};
export default Footer;