import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, X, Mail } from 'lucide-react';
import '../Style/Login.css';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  // --- LOGIN LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // 1. Connect to Backend
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // 2. Handle Errors (401/403)
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Invalid Email or Password');
      }

      // 3. Parse Response
      const data = await response.json();

      console.log('✅ Login successful:', data);

      // 4. Save to Local Storage - ALL REQUIRED KEYS
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role); // ADMIN or PROVIDER (for ProtectedRoute)
      localStorage.setItem('userType', data.role.toLowerCase()); // admin or provider (for Navigation)
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userName', data.email);
      localStorage.setItem('userEmail', data.email);

      console.log('💾 Saved to localStorage:', {
        token: '✓',
        role: data.role,
        userType: data.role.toLowerCase(),
        userId: data.id,
        userName: data.email
      });

      // 5. Force Navigation to re-render by dispatching custom event
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'userType',
        newValue: data.role.toLowerCase(),
        url: window.location.href
      }));

      // 6. Small delay to ensure Navigation updates before redirect
      await new Promise(resolve => setTimeout(resolve, 100));

      // 7. Redirect based on Role
      if (data.role === 'ADMIN') {
        console.log('🔄 Redirecting to Admin Dashboard...');
        navigate('/admindashboard', { replace: true });
      } else if (data.role === 'PROVIDER') {
        console.log('🔄 Redirecting to Provider Dashboard...');
        navigate('/providerdashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }

    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // --- FORGOT PASSWORD LOGIC ---
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMessage('Please enter your email address.');
      return;
    }
    setForgotMessage('Password reset instructions have been sent to your email.');
    setTimeout(() => {
      setShowForgotPassword(false);
      setForgotEmail('');
      setForgotMessage('');
    }, 3000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Shield className="login-icon" />
          <h1>Welcome Back</h1>
          <p>Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-box">{error}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="youremail@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <div className="forgot-password">
              <span onClick={() => setShowForgotPassword(true)}>Forgot Password?</span>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <button onClick={() => navigate('/register')} className="register-link">
            Register as Provider
          </button>
          <button onClick={() => navigate('/')}>← Back to Home</button>
        </div>

        <div className="login-note">
          <p>
            <strong>Note:</strong> Only PUCSL admin and registered service
            providers can log in. New providers can register through the registration form.
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Reset Password</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmail('');
                  setForgotMessage('');
                }}
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleForgotPassword} className="forgot-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              {forgotMessage && (
                <div className={`message ${forgotMessage.includes('sent') ? 'success' : 'error'}`}>
                  {forgotMessage}
                </div>
              )}
              <button type="submit" className="reset-btn">
                <Mail className="btn-icon" />
                Send Reset Instructions
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;