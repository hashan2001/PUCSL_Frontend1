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
    contact_number: '',
    district: '',
    profile_photo: null,
    status: '',
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  // Fetch provider data from localStorage
  useEffect(() => {
    const fetchProvider = () => {
      try {
        const storedProviders = JSON.parse(localStorage.getItem('providers') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        if (currentUser && currentUser.role === 'provider') {
          const providerData = storedProviders.find(p => p.email === currentUser.email);
          if (providerData) {
            setProvider(providerData);
            setFormData({
              contact_number: providerData.contact_number || '',
              district: providerData.district || '',
              profile_photo: null,
            });
            if (providerData.profile_photo) {
              setPhotoPreview(providerData.profile_photo);
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching provider:', error);
        setLoading(false);
      }
    };
    fetchProvider();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_photo: file });
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Update provider data in localStorage
    try {
      const storedProviders = JSON.parse(localStorage.getItem('providers') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

      const updatedProviders = storedProviders.map(p => {
        if (p.email === currentUser.email) {
          return {
            ...p,
            contact_number: formData.contact_number,
            district: formData.district,
            profile_photo: photoPreview || p.profile_photo,
            status: formData.status,
          };
        }
        return p;
      });

      localStorage.setItem('providers', JSON.stringify(updatedProviders));

      setTimeout(() => {
        alert('✅ Profile updated successfully!');
        setSubmitting(false);
        navigate('/provider');
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('❌ Error updating profile. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="error-container">
        <div className="error-box">
          <h2>Profile Not Found</h2>
          <p>Unable to load your profile information.</p>
          <button onClick={() => navigate('/provider')}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <div className="header-section">
        <div className="header-container">
          <button onClick={() => navigate('/provider')} className="back-button">
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
              <strong>Note:</strong> You can update your contact number, district, and status.
              For other changes, please contact PUCSL admin.
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
                        setFormData({ ...formData, profile_photo: null });
                      }}
                      className="remove-photo-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                required
                value={formData.contact_number}
                onChange={(e) =>
                  setFormData({ ...formData, contact_number: e.target.value })
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
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="button-group">
              <button type="submit" disabled={submitting} className="save-btn">
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/provider')}
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