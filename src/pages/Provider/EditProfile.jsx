import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Upload } from 'lucide-react';
import '../../Style/EditProfile.css';

const districts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

export const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [provider, setProvider] = useState(null);
  const [formData, setFormData] = useState({
    contactNumber: '',
    district: '',
    address: '',
    bio: '',
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  // Fetch provider data from backend
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        console.log('🔍 FETCHING PROVIDER DATA FOR EDIT, USER ID:', userId);

        if (!userId) {
          console.error('❌ No userId found');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch provider data');
        }

        const data = await response.json();
        console.log('✅ PROVIDER DATA LOADED FOR EDIT:', data);

        setProvider(data);
        setFormData({
          contactNumber: data.contactNumber || data.contact_number || '',
          district: data.district || '',
          address: data.address || '',
          bio: data.bio || '',
        });

        if (data.profilePhoto || data.profile_photo) {
          setPhotoPreview(data.profilePhoto || data.profile_photo);
        }

        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching provider:', error);
        alert('Failed to load profile data. Please try again.');
        setLoading(false);
      }
    };

    fetchProvider();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      console.log('💾 UPDATING PROVIDER DATA:', formData);

      // Prepare update data
      const updateData = {
        contactNumber: formData.contactNumber,
        district: formData.district,
        address: formData.address,
        bio: formData.bio,
      };

      // If photo was changed, include it (Base64 or FormData depending on your backend)
      if (photoPreview && photoPreview !== provider.profilePhoto) {
        updateData.profilePhoto = photoPreview;
      }

      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT', // or 'PATCH' if your backend uses PATCH
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update profile');
      }

      const updatedData = await response.json();
      console.log('✅ PROFILE UPDATED SUCCESSFULLY:', updatedData);

      alert('✅ Profile updated successfully!');
      navigate('/providerdashboard');

    } catch (error) {
      console.error('❌ Error updating profile:', error);
      alert(`❌ Error updating profile: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="error-container">
        <div className="error-box">
          <h2>Profile Not Found</h2>
          <p>Unable to load your profile information.</p>
          <button onClick={() => navigate('/providerdashboard')}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <div className="header-section">
        <div className="header-container">
          <button onClick={() => navigate('/providerdashboard')} className="back-button">
            <ArrowLeft className="icon" />
            <span>Back to Dashboard</span>
          </button>
          <h1>Edit Profile</h1>
        </div>
      </div>

      <div className="form-container">
        <div className="form-box">
          <div className="note-box">
            <p>
              <strong>Note:</strong> Update your contact information and service details.
              Your PUCSL badge number and verification status can only be changed by admin.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Profile Photo Upload */}
            <div className="form-group">
              <label>Profile Photo</label>
              <div className="photo-upload-container">
                <div className="photo-preview">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile Preview" className="preview-image" />
                  ) : (
                    <div className="photo-placeholder">
                      <Camera className="camera-icon" />
                      <span>No photo selected</span>
                    </div>
                  )}
                </div>
                <div className="photo-upload-controls">
                  <input
                    type="file"
                    id="profile-photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="profile-photo" className="upload-btn">
                    <Upload className="upload-icon" />
                    Choose Photo
                  </label>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview(null);
                      }}
                      className="remove-photo-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Read-only fields */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={provider.fullName || provider.full_name || ''}
                disabled
                className="disabled-input"
              />
              <small>Contact admin to change this field</small>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={provider.email || ''}
                disabled
                className="disabled-input"
              />
              <small>Contact admin to change this field</small>
            </div>

            <div className="form-group">
              <label>Service Type</label>
              <input
                type="text"
                value={provider.serviceType || provider.service_type || ''}
                disabled
                className="disabled-input"
              />
              <small>Contact admin to change this field</small>
            </div>

            {/* Editable fields */}
            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                required
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                placeholder="+94 XX XXX XXXX"
              />
            </div>

            <div className="form-group">
              <label>District *</label>
              <select
                required
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Your service address"
              />
            </div>

            <div className="form-group">
              <label>Bio / Description</label>
              <textarea
                rows="4"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell customers about your services and experience..."
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <input
                type="text"
                value={provider.status || 'PENDING'}
                disabled
                className="disabled-input"
              />
              <small>Only admin can change verification status</small>
            </div>

            <div className="button-group">
              <button type="submit" disabled={submitting} className="save-btn">
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/providerdashboard')}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;