import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import '../../Style/AddProvider.css';

const districts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Monaragala', 'Ratnapura', 'Kegalle'
];

export const AddProvider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;
  const isEdit = !!provider;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadMode, setUploadMode] = useState('manual');
  const [csvFile, setCsvFile] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    serviceType: 'AC',
    contactNumber: '',
    district: '',
    address: '',
    courseLevel: '',
    pucslBadgeNumber: '',
    bio: '',
  });

  useEffect(() => {
    if (isEdit && provider) {
      setFormData({
        email: provider.email || '',
        password: '',
        fullName: provider.fullName || '',
        serviceType: provider.serviceType || 'AC',
        contactNumber: provider.contactNumber || '',
        district: provider.district || '',
        address: provider.address || '',
        courseLevel: provider.courseLevel || '',
        pucslBadgeNumber: provider.pucslBadgeNumber || '',
        bio: provider.bio || '',
      });
    }
  }, [isEdit, provider]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (uploadMode === 'csv' && csvFile) {
      // Handle CSV upload
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target.result;
        const rows = csvText.split('\n').filter(row => row.trim());
        const providers = rows.slice(1).map(row => {
          const [fullName, email, password, serviceType, contactNumber, district, address, pucslBadgeNumber, bio] = row.split(',');
          return { fullName, email, password, serviceType, contactNumber, district, address, pucslBadgeNumber, bio };
        });

        setTimeout(() => {
          alert(`${providers.length} providers added successfully from CSV!`);
          setLoading(false);
          navigate('/search');
        }, 2000);
      };
      reader.readAsText(csvFile);
    } else {
      // Real API call for manual entry
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          alert('You must be logged in as admin to add providers');
          navigate('/login');
          return;
        }

        const url = isEdit 
          ? `http://localhost:8080/api/users/providers/${provider.id}`
          : 'http://localhost:8080/api/users/providers';
        
        const method = isEdit ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const data = await response.json();
          alert(isEdit ? 'Provider updated successfully!' : 'Provider added successfully!');
          // Redirect to search page after successful save
          navigate('/search');
        } else {
          const data = await response.json();
          setError(data.error || 'Failed to save provider');
        }
      } catch (err) {
        console.error('Error saving provider:', err);
        setError('Network error. Please check if the backend is running.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      alert('Please select a valid CSV file.');
    }
  };

  return (
    <div className="add-provider-page">
      <div className="add-provider-header">
        <div>
          <button
            onClick={() => navigate('/providermanagement')}
            className="back-button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Provider Management</span>
          </button>
          <h1>{isEdit ? 'Edit Provider' : 'Add New Provider'}</h1>
        </div>
      </div>

      <div className="add-provider-container">
        {/* Display error message if exists */}
        {error && (
          <div className="error-message" style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            color: '#c00'
          }}>
            {error}
          </div>
        )}

        {!isEdit && (
          <>
            {/* Upload Mode Selection - Commented out as per original */}
            {/* <div className="upload-mode-selector">
              <button
                type="button"
                className={`mode-button ${uploadMode === 'manual' ? 'active' : ''}`}
                onClick={() => setUploadMode('manual')}
              >
                📝 Manual Entry
              </button>
              <button
                type="button"
                className={`mode-button ${uploadMode === 'csv' ? 'active' : ''}`}
                onClick={() => setUploadMode('csv')}
              >
                <Upload className="w-4 h-4" />
                📄 CSV Upload
              </button>
            </div> */}
          </>
        )}

        {uploadMode === 'csv' ? (
          <div className="csv-upload-section">
            <div className="csv-upload-box">
              <label className="csv-label">
                <Upload className="w-8 h-8" />
                <span>Choose CSV File</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
              {csvFile && (
                <p className="file-name">Selected: {csvFile.name}</p>
              )}
              <p className="csv-instructions">
                CSV format: fullName,email,password,serviceType,contactNumber,district,address,pucslBadgeNumber,bio
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter provider mail address"
                />
              </div>

              {!isEdit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type *
                </label>
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose your Service</option>
                  <option value="AC">Air Conditioning</option>
                  <option value="RAC">Refrigerator & Air Conditioning</option>
                  <option value="Electrician">Electrician</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+94 XX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <select
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-full-width">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter complete address"
              />
            </div>

            <div className="form-full-width">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Level *
              </label>
              <input
                type="text"
                required
                value={formData.courseLevel}
                onChange={(e) => setFormData({ ...formData, courseLevel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Level Of Course"
              />
            </div>

            <div className="form-full-width">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PUCSL Badge Number *
              </label>
              <input
                type="text"
                required
                value={formData.pucslBadgeNumber}
                onChange={(e) => setFormData({ ...formData, pucslBadgeNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter PUCSL badge number"
              />
            </div>

            <div className="form-full-width">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio / Description *
              </label>
              <textarea
                rows={4}
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the provider's experience and services..."
              />
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? (isEdit ? 'Updating Provider...' : 'Adding Provider...') : (isEdit ? 'Update Provider' : 'Add Provider')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/providermanagement')}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {uploadMode === 'csv' && (
          <div className="form-buttons">
            <button
              type="button"
              onClick={() => handleSubmit({ preventDefault: () => {} })}
              disabled={loading || !csvFile}
              className="submit-button"
            >
              {loading ? 'Uploading...' : 'Upload CSV'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/providermanagement')}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProvider;