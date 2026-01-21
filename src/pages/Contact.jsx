import React, { useState } from 'react';
import '../Style/Contact.css';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      console.log('📧 SENDING CONTACT MESSAGE:', formData);

      // Send to backend API
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      console.log('✅ MESSAGE SENT SUCCESSFULLY');

      // Also save to localStorage for admin dashboard notifications
      const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      const newMessage = {
        id: Date.now(),
        ...formData,
        timestamp: new Date().toISOString(),
        read: false,
      };
      existingMessages.push(newMessage);
      localStorage.setItem('contactMessages', JSON.stringify(existingMessages));

      // Show success message
      setSubmitted(true);
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);

    } catch (err) {
      console.error('❌ ERROR SENDING MESSAGE:', err);
      setError('Failed to send message. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Header Section */}
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with PUCSL for inquiries and support</p>
      </header>

      {/* Contact Info & Form Section */}
      <section className="contact-container">
        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info">
            <h2>Get In Touch</h2>

            <div className="info-item">
              <div className="icon"><MapPin size={22} /></div>
              <div>
                <h3>Office Address</h3>
                <p>
                  Public Utilities Commission of Sri Lanka<br />
                  6th Floor, BOC Merchant Tower<br />
                  No. 28, St. Michael's Road<br />
                  Colombo 03, Sri Lanka
                </p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon"><Phone size={22} /></div>
              <div>
                <h3>Phone</h3>
                <p>+94 11 2 575 793<br />+94 77 9590 950</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon"><Mail size={22} /></div>
              <div>
                <h3>Email</h3>
                <p>info@pucsl.gov.lk<br />marketplace@pucsl.gov.lk</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon"><Clock size={22} /></div>
              <div>
                <h3>Office Hours</h3>
                <p>Monday - Friday: 8:30 AM - 4:15 PM<br />
                <small>(Closed on weekends and public holidays)</small></p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form">
            <h2>Send Us a Message</h2>
            
            {submitted && (
              <div className="success-message">
                ✅ Thank you! Your message has been sent successfully. We'll get back to you soon.
              </div>
            )}

            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label>Your Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+94 XX XXX XXXX"
                value={formData.phone}
                onChange={handleInputChange}
              />

              <label>Subject *</label>
              <input
                type="text"
                name="subject"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />

              <label>Message *</label>
              <textarea
                rows="5"
                name="message"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>

              <button type="submit" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>

        <div className="faq">
          <h3>How do I become a registered service provider?</h3>
          <p>
            Service providers can only be registered by PUCSL administrators.
            Please contact our office with your credentials and license information for verification.
          </p>
        </div>

        <div className="faq">
          <h3>How are service providers verified?</h3>
          <p>
            All service providers undergo a thorough verification process including license validation,
            credential checks, and compliance with PUCSL regulations.
          </p>
        </div>

        <div className="faq">
          <h3>Can I report a service provider?</h3>
          <p>
            Yes, you can contact us directly via email or phone to report any concerns about a service provider.
            We take all complaints seriously and investigate promptly.
          </p>
        </div>

        <div className="faq">
          <h3>Is there a fee to use this marketplace?</h3>
          <p>
            No, the marketplace is completely free for consumers to use. Service providers pay no listing fees either.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;