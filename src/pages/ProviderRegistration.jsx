import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import '../Style/ProviderRegistration.css';

const ProviderRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    full_name: '',
    email: '',
    password: '',
    contact_number: '',
    address: '',
    district: '',
    service_type: '',
    course_level: '',
    bio: '',
    pucsl_badge_number: '',
    status: 'pending',
    created_at: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const districts = [
    'Colombo', 'Kandy', 'Galle', 'Matara', 'Jaffna', 'Kurunegala', 'Negombo',
    'Anuradhapura', 'Batticaloa', 'Trincomalee', 'Badulla', 'Ratnapura',
    'Ampara', 'Hambantota', 'Kalutara', 'Kegalle', 'Mannar', 'Monaragala',
    'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Vavuniya'
  ];

  const serviceTypes = ['AC', 'RAC', 'Electrician'];
  const courseLevels = ['NVQ 3', 'NVQ 4', 'NVQ 5'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ⭐⭐ FULLY UPDATED BACKEND CONNECTION CODE ⭐⭐
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const requiredFields = [
      'full_name', 'email', 'password', 'contact_number',
      'address', 'district', 'service_type',
      'course_level', 'pucsl_badge_number'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    const contactRegex = /^(\+94|0)[0-9]{9}$/;
    if (!contactRegex.test(formData.contact_number)) {
      setError('Please enter a valid Sri Lankan contact number');
      setLoading(false);
      return;
    }

    try {
      // 🔥 REAL BACKEND API CALL (Spring Boot)
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.full_name,
          email: formData.email,
          password: formData.password,
          contactNumber: formData.contact_number,
          address: formData.address,
          district: formData.district,
          serviceType: formData.service_type,
          courseLevel: formData.course_level,
          bio: formData.bio,
          pucslBadgeNumber: formData.pucsl_badge_number,
          role: "PROVIDER",
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      setSuccess("Registration submitted! Your application will be reviewed by PUCSL admin.");

      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <UserPlus className="registration-icon" />
          <h1>Provider Registration</h1>
          <p>Join PUCSL as a certified service provider</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="full_name">Full Name *</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact_number">Contact Number *</label>
              <input
                type="tel"
                id="contact_number"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="+94 77 123 4567"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="district">District *</label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="service_type">Service Type *</label>
              <select
                id="service_type"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Service Type</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="course_level">Course Level *</label>
              <select
                id="course_level"
                name="course_level"
                value={formData.course_level}
                onChange={handleChange}
                required
              >
                <option value="">Select Course Level</option>
                {courseLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pucsl_badge_number">PUCSL Badge Number *</label>
              <input
                type="text"
                id="pucsl_badge_number"
                name="pucsl_badge_number"
                value={formData.pucsl_badge_number}
                onChange={handleChange}
                placeholder="PUCSL-XXX-2024-XXX"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio (Optional)</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about your experience and services..."
              rows="4"
            />
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Submitting Registration...' : 'Register as Provider'}
          </button>
        </form>

        <div className="registration-footer">
          <button onClick={() => navigate('/login')} className="back-btn">
            <ArrowLeft size={16} />
            Back to Login
          </button>
        </div>

        <div className="registration-note">
          <p>
            <strong>Note:</strong> All registrations are subject to PUCSL verification.
            You will receive an email confirmation once your application is reviewed.
            Only verified providers can access the system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistration;
