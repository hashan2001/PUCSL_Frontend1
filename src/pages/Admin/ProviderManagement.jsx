// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Search,
//   Edit,
//   Trash2,
//   CheckCircle,
//   XCircle,
//   Eye,
//   Plus
// } from 'lucide-react';
// import '../../Style/ProviderManagement.css';

// export const ProviderManagement = () => {
//   const navigate = useNavigate();

//   const [providers, setProviders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [serviceFilter, setServiceFilter] = useState('');
//   const [selectedProviders, setSelectedProviders] = useState([]);
//   const [error, setError] = useState('');

//   // Helper to get auth header if token present
//   const getAuthHeaders = () => {
//     const headers = { 'Content-Type': 'application/json' };
//     const token = localStorage.getItem('token');
//     if (token) headers['Authorization'] = `Bearer ${token}`;
//     return headers;
//   };

//   // Load providers (role = PROVIDER) from backend
//   useEffect(() => {
//     const fetchProviders = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const res = await fetch('http://localhost:8080/api/users/providers', {
//           method: 'GET',
//           headers: getAuthHeaders(),
//         });

//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(text || 'Failed to load providers');
//         }

//         const data = await res.json();
//         // data expected as list of User objects (matching your entity)
//         setProviders(data);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to load providers. Check server or token.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProviders();
//   }, []);

//   // Filtering logic
//   const filteredProviders = providers.filter((provider) => {
//     const query = searchQuery.toLowerCase();
//     const matchesQuery =
//       (provider.fullName && provider.fullName.toLowerCase().includes(query)) ||
//       (provider.district && provider.district.toLowerCase().includes(query)) ||
//       (provider.contactNumber && provider.contactNumber.includes(query)) ||
//       (provider.pucslBadgeNumber && provider.pucslBadgeNumber.toLowerCase().includes(query));
//     const matchesStatus = statusFilter === '' || (provider.status && provider.status.toLowerCase() === statusFilter.toLowerCase());
//     const matchesService = serviceFilter === '' || (provider.serviceType && provider.serviceType === serviceFilter);
//     return matchesQuery && matchesStatus && matchesService;
//   });

//   const updateLocalProviderStatus = (id, status) => {
//     setProviders(prev => prev.map(p => p.id === id ? { ...p, status } : p));
//   };

//   // Update provider status (verified / suspended / pending / rejected)
//   const changeStatus = async (id, status) => {
//     setError('');
//     try {
//       const res = await fetch(`http://localhost:8080/api/users/${id}/status`, {
//         method: 'PUT',
//         headers: getAuthHeaders(),
//         body: JSON.stringify({ status }),
//       });

//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(txt || 'Failed to update status');
//       }

//       // Update UI optimistically
//       updateLocalProviderStatus(id, status);
//     } catch (err) {
//       console.error(err);
//       setError('Could not update status. Check console for details.');
//     }
//   };

//   // Delete provider
//   const deleteProvider = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this provider?')) return;
//     setError('');
//     try {
//       const res = await fetch(`http://localhost:8080/api/users/${id}`, {
//         method: 'DELETE',
//         headers: getAuthHeaders(),
//       });

//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(txt || 'Delete failed');
//       }

//       setProviders(prev => prev.filter(p => p.id !== id));
//       setSelectedProviders(prev => prev.filter(pid => pid !== id));
//     } catch (err) {
//       console.error(err);
//       setError('Delete failed. Check console for details.');
//     }
//   };

//   return (
//     <div className="provider-page">
//       <div className="provider-header">
//         <div className="header-content">
//           <h1>Provider Management</h1>
//           <button
//             onClick={() => navigate('/addprovider')}
//             className="add-btn"
//           >
//             <Plus size={16} />
//             Add New Provider
//           </button>
//         </div>
//       </div>

//       <div className="provider-container">
//         {/* Filters */}
//         <div className="filter-box">
//           <div className="search-box highlight">
//             <Search className="search-icon" />
//             <input
//               type="text"
//               placeholder="Search by name, district, contact or badge..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <div className="filter-row">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="">All Status</option>
//               <option value="Pending">Pending</option>
//               <option value="Verified">Verified</option>
//               <option value="Suspended">Suspended</option>
//               <option value="Rejected">Rejected</option>
//             </select>

//             <select
//               value={serviceFilter}
//               onChange={(e) => setServiceFilter(e.target.value)}
//             >
//               <option value="">All Services</option>
//               <option value="AC">AC</option>
//               <option value="RAC">RAC</option>
//               <option value="Electrician">Electrician</option>
//             </select>
//           </div>
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="loading-spinner">Loading...</div>
//         ) : (
//           <>
//             {error && <div className="error-box">{error}</div>}

//             {filteredProviders.length === 0 ? (
//               <div className="no-data-box">
//                 <p>No providers found</p>
//               </div>
//             ) : (
//               <div className="table-wrapper">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>
//                         <input
//                           type="checkbox"
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setSelectedProviders(filteredProviders.map(p => p.id));
//                             } else {
//                               setSelectedProviders([]);
//                             }
//                           }}
//                           checked={selectedProviders.length === filteredProviders.length && filteredProviders.length > 0}
//                         />
//                         Provider
//                       </th>
//                       <th>Service</th>
//                       <th>District</th>
//                       <th>Contact</th>
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredProviders.map((provider) => (
//                       <tr key={provider.id}>
//                         <td>
//                           <input
//                             type="checkbox"
//                             checked={selectedProviders.includes(provider.id)}
//                             onChange={(e) => {
//                               if (e.target.checked) {
//                                 setSelectedProviders(prev => [...prev, provider.id]);
//                               } else {
//                                 setSelectedProviders(prev => prev.filter(id => id !== provider.id));
//                               }
//                             }}
//                           />
//                           <div className="provider-info">
//                             <div className="provider-name">{provider.fullName}</div>
//                             {provider.pucslBadgeNumber && <div className="badge-text">Badge: {provider.pucslBadgeNumber}</div>}
//                             <div className="provider-email">{provider.email}</div>
//                           </div>
//                         </td>

//                         <td><span className="service-tag">{provider.serviceType}</span></td>
//                         <td>{provider.district}</td>
//                         <td>{provider.contactNumber}</td>
//                         <td>
//                           <span className={`status-badge ${provider.status?.toLowerCase() || ''}`}>
//                             {provider.status}
//                           </span>
//                         </td>

//                         <td>
//                           <div className="action-btns">
//                             <button
//                               onClick={() => navigate(`/provider/${provider.id}`)}
//                               title="View"
//                               className="icon-btn view"
//                             >
//                               <Eye size={16} />
//                             </button>

//                             <button
//                               onClick={() => navigate('/addprovider', { state: { provider } })}
//                               title="Edit"
//                               className="icon-btn edit"
//                             >
//                               <Edit size={16} />
//                             </button>

//                             <button
//                               onClick={() => changeStatus(provider.id, 'Verified')}
//                               title="Verify"
//                               className="icon-btn verify"
//                             >
//                               <CheckCircle size={16} />
//                             </button>

//                             <button
//                               onClick={() => changeStatus(provider.id, 'Suspended')}
//                               title="Suspend"
//                               className="icon-btn suspend"
//                             >
//                               <XCircle size={16} />
//                             </button>

//                             <button
//                               onClick={() => deleteProvider(provider.id)}
//                               title="Delete"
//                               className="icon-btn delete"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProviderManagement;





























import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Plus
} from 'lucide-react';
import '../../Style/ProviderManagement.css';

export const ProviderManagement = () => {
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [error, setError] = useState('');

  // ---- GET TOKEN ----
  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  // ---- FETCH PROVIDERS ----
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`http://localhost:8080/api/users/providers`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed fetching providers");
        }

        const data = await res.json();
        setProviders(data);

      } catch (err) {
        console.error(err);
        setError('Failed to load providers. Please check backend or token.');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // ---- FILTERING ----
  const filteredProviders = providers.filter((provider) => {
    const query = searchQuery.toLowerCase();

    const matchesQuery =
      provider.fullName?.toLowerCase().includes(query) ||
      provider.email?.toLowerCase().includes(query) ||
      provider.district?.toLowerCase().includes(query) ||
      provider.contactNumber?.includes(query) ||
      provider.pucslBadgeNumber?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === '' ||
      provider.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesService =
      serviceFilter === '' ||
      provider.serviceType?.toLowerCase() === serviceFilter.toLowerCase();

    return matchesQuery && matchesStatus && matchesService;
  });

  // ---- UPDATE STATUS ----
  const updateLocalProviderStatus = (id, status) => {
    setProviders(prev =>
      prev.map(p => p.id === id ? { ...p, status } : p)
    );
  };

  const changeStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error(await res.text());

      updateLocalProviderStatus(id, status);
    } catch (err) {
      console.error(err);
      setError("Could not update provider status.");
    }
  };

  // ---- DELETE PROVIDER ----
  const deleteProvider = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error(await res.text());

      setProviders(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      setError("Delete failed.");
    }
  };

  // ---- UI ----
  return (
    <div className="provider-page">
      <div className="provider-header">
        <div className="header-content">
          <h1>Provider Management</h1>
          <button onClick={() => navigate('/addprovider')} className="add-btn">
            <Plus size={16} /> Add New Provider
          </button>
        </div>
      </div>

      <div className="provider-container">

        {/* Filters */}
        <div className="filter-box">
          <div className="search-box highlight">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, district, contact, badge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-row">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Verified">Verified</option>
              <option value="Suspended">Suspended</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Service Filter */}
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="">All Services</option>
              <option value="AC">AC</option>
              <option value="RAC">RAC</option>
              <option value="Electrician">Electrician</option>
              <option value="IT">IT</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            {error && <div className="error-box">{error}</div>}

            {filteredProviders.length === 0 ? (
              <div className="no-data-box">No providers found</div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>Service</th>
                      <th>District</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProviders.map(provider => (
                      <tr key={provider.id}>
                        <td>
                          <div className="provider-info">
                            <div className="provider-name">{provider.fullName}</div>
                            <div className="provider-email">{provider.email}</div>
                            {provider.pucslBadgeNumber && (
                              <div className="badge-text">
                                Badge: {provider.pucslBadgeNumber}
                              </div>
                            )}
                          </div>
                        </td>

                        <td>{provider.serviceType}</td>
                        <td>{provider.district}</td>
                        <td>{provider.contactNumber}</td>

                        <td>
                          <span className={`status-badge ${provider.status?.toLowerCase()}`}>
                            {provider.status}
                          </span>
                        </td>

                        <td>
                          <div className="action-btns">

                            {/* View */}
                            <button
                              onClick={() => navigate(`/provider/${provider.id}`)}
                              className="icon-btn view"
                            >
                              <Eye size={16} />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => navigate('/addprovider', { state: { provider } })}
                              className="icon-btn edit"
                            >
                              <Edit size={16} />
                            </button>

                            {/* Verify */}
                            <button
                              onClick={() => changeStatus(provider.id, "VERIFIED")}
                              className="icon-btn verify"
                            >
                              <CheckCircle size={16} />
                            </button>

                            {/* Suspend */}
                            <button
                              onClick={() => changeStatus(provider.id, "SUSPENDED")}
                              className="icon-btn suspend"
                            >
                              <XCircle size={16} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteProvider(provider.id)}
                              className="icon-btn delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderManagement;
