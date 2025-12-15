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
  const [uploadMode, setUploadMode] = useState('manual'); // 'manual' or 'csv'
  const [csvFile, setCsvFile] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    service_type: 'AC',
    contact_number: '',
    district: '',
    address: '',
    course_level: '',
    pucsl_badge_number: '',
    bio: '',
  });

  useEffect(() => {
    if (isEdit && provider) {
      setFormData({
        email: provider.email || '',
        password: '', // Don't populate password for security
        full_name: provider.full_name || '',
        service_type: provider.service_type || 'AC',
        contact_number: provider.contact_number || '',
        district: provider.district || '',
        address: provider.address || '',
        course_level: provider.course_level || '',
        pucsl_badge_number: provider.pucsl_badge_number || '',
        bio: provider.bio || '',
      });
    }
  }, [isEdit, provider]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (uploadMode === 'csv' && csvFile) {
      // Handle CSV upload
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target.result;
        // Parse CSV and process (simplified)
        const rows = csvText.split('\n').filter(row => row.trim());
        const providers = rows.slice(1).map(row => {
          const [full_name, email, password, service_type, contact_number, district, address, pucsl_badge_number, bio] = row.split(',');
          return { full_name, email, password, service_type, contact_number, district, address, pucsl_badge_number, bio };
        });

        // Simulate bulk upload
        setTimeout(() => {
          alert(`${providers.length} providers added successfully from CSV!`);
          setLoading(false);
          navigate('/admin/providers');
        }, 2000);
      };
      reader.readAsText(csvFile);
    } else {
      // Simulate form submission (replace with your API call)
      setTimeout(() => {
        alert('Provider added successfully!');
        setLoading(false);
        navigate('/admin/providers');
      }, 1000);
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
        {!isEdit && (
          <>
            {/* Upload Mode Selection */}
            <div className="upload-mode-selector">
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
            </div>
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
                CSV format: full_name,email,password,service_type,contact_number,district,address,pucsl_badge_number,bio
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
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
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
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type *
                </label>
                <select
                  required
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
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
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
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
                value={formData.course_level}
                onChange={(e) => setFormData({ ...formData, course_level: e.target.value })}
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
                value={formData.pucsl_badge_number}
                onChange={(e) => setFormData({ ...formData, pucsl_badge_number: e.target.value })}
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
                onClick={() => navigate('/admin/providers')}
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
              onClick={() => navigate('/admin/providers')}
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
































































































// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation, useParams } from 'react-router-dom';
// import { ArrowLeft, Upload } from 'lucide-react';
// import '../../Style/AddProvider.css';

// const districts = [
//   'Colombo','Gampaha','Kalutara','Kandy','Matale','Nuwara Eliya',
//   'Galle','Matara','Hambantota','Jaffna','Kilinochchi','Mannar',
//   'Vavuniya','Mullaitivu','Batticaloa','Ampara','Trincomalee',
//   'Kurunegala','Puttalam','Anuradhapura','Polonnaruwa','Badulla',
//   'Monaragala','Ratnapura','Kegalle'
// ];

// export const AddProvider = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = useParams();

//   const provider = location.state?.provider;
//   const isEdit = !!provider;

//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     full_name: '',
//     email: '',
//     password: '',
//     service_type: 'Electrician',
//     contact_number: '',
//     district: '',
//     address: '',
//     course_level: '',
//     pucsl_badge_number: '',
//     bio: ''
//   });

//   // LOAD PROVIDER WHEN EDIT
//   useEffect(() => {
//     if (isEdit && provider) {
//       fetch(`http://localhost:8080/api/users/${provider.id}`)
//         .then(res => res.json())
//         .then(data => {
//           setFormData({
//             full_name: data.fullName || '',
//             email: data.email || '',
//             password: '', // never show backend password
//             service_type: data.serviceType || '',
//             contact_number: data.contactNumber || '',
//             district: data.district || '',
//             address: data.address || '',
//             course_level: data.courseLevel || '',
//             pucsl_badge_number: data.pucslBadgeNumber || '',
//             bio: data.bio || ''
//           });
//         });
//     }
//   }, [isEdit, provider]);

//   // HANDLE SUBMIT (ADD or UPDATE)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Convert frontend names to backend names
//     const payload = {
//       fullName: formData.full_name,
//       email: formData.email,
//       serviceType: formData.service_type,
//       contactNumber: formData.contact_number,
//       district: formData.district,
//       address: formData.address,
//       courseLevel: formData.course_level,
//       pucslBadgeNumber: formData.pucsl_badge_number,
//       bio: formData.bio
//     };

//     // Only send password if adding OR user typed new password
//     if (!isEdit || (isEdit && formData.password !== "")) {
//       payload.password = formData.password;
//     }

//     try {
//       const response = await fetch(
//         isEdit
//           ? `http://localhost:8080/api/users/${provider.id}`
//           : "http://localhost:8080/api/users",
//         {
//           method: isEdit ? "PUT" : "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload)
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Error saving provider.");
//       }

//       alert(isEdit ? "Provider updated successfully!" : "Provider created!");
//       navigate("/providermanagement");

//     } catch (error) {
//       alert(error.message);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="add-provider-page">
//       <div className="add-provider-header">
//         <div>
//           <button
//             onClick={() => navigate('/providermanagement')}
//             className="back-button"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Back to Provider Management</span>
//           </button>
//           <h1>{isEdit ? "Edit Provider" : "Add New Provider"}</h1>
//         </div>
//       </div>

//       <div className="add-provider-container">
//         <form onSubmit={handleSubmit}>

//           <div className="form-grid">
//             {/* FULL NAME */}
//             <div>
//               <label>Full Name *</label>
//               <input
//                 type="text"
//                 required
//                 value={formData.full_name}
//                 onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
//               />
//             </div>

//             {/* EMAIL */}
//             <div>
//               <label>Email *</label>
//               <input
//                 type="email"
//                 required
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               />
//             </div>

//             {/* PASSWORD – only required for Add */}
//             {!isEdit && (
//               <div>
//                 <label>Password *</label>
//                 <input
//                   type="password"
//                   required
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 />
//               </div>
//             )}

//             {/* PASSWORD – optional for update */}
//             {isEdit && (
//               <div>
//                 <label>New Password (optional)</label>
//                 <input
//                   type="password"
//                   placeholder="Leave blank to keep existing"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 />
//               </div>
//             )}

//             {/* SERVICE TYPE */}
//             <div>
//               <label>Service Type *</label>
//               <select
//                 value={formData.service_type}
//                 onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
//               >
//                 <option value="Electrician">Electrician</option>
//                 <option value="AC">AC Technician</option>
//                 <option value="RAC">RAC Technician</option>
//               </select>
//             </div>

//             {/* CONTACT NUMBER */}
//             <div>
//               <label>Contact Number *</label>
//               <input
//                 type="text"
//                 required
//                 value={formData.contact_number}
//                 onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
//               />
//             </div>

//             {/* DISTRICT */}
//             <div>
//               <label>District *</label>
//               <select
//                 value={formData.district}
//                 onChange={(e) => setFormData({ ...formData, district: e.target.value })}
//                 required
//               >
//                 <option value="">Select District</option>
//                 {districts.map((d) => (
//                   <option key={d} value={d}>{d}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* ADDRESS */}
//           <div className="form-full-width">
//             <label>Address *</label>
//             <input
//               type="text"
//               required
//               value={formData.address}
//               onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//             />
//           </div>

//           {/* COURSE LEVEL */}
//           <div className="form-full-width">
//             <label>Course Level *</label>
//             <input
//               type="text"
//               required
//               value={formData.course_level}
//               onChange={(e) => setFormData({ ...formData, course_level: e.target.value })}
//             />
//           </div>

//           {/* PUCSL BADGE */}
//           <div className="form-full-width">
//             <label>PUCSL Badge Number *</label>
//             <input
//               type="text"
//               required
//               value={formData.pucsl_badge_number}
//               onChange={(e) => setFormData({ ...formData, pucsl_badge_number: e.target.value })}
//             />
//           </div>

//           {/* BIO */}
//           <div className="form-full-width">
//             <label>Bio *</label>
//             <textarea
//               rows={4}
//               required
//               value={formData.bio}
//               onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
//             />
//           </div>

//           <div className="form-buttons">
//             <button type="submit" disabled={loading} className="submit-button">
//               {loading ? (isEdit ? "Updating..." : "Saving...") : (isEdit ? "Update Provider" : "Add Provider")}
//             </button>

//             <button
//               type="button"
//               onClick={() => navigate('/providermanagement')}
//               className="cancel-button"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProvider;
