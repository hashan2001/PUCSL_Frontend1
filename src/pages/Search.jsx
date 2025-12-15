// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../Style/Search.css";

// const ServiceProviderSearch = () => {
//   const navigate = useNavigate();
//   const [showFilters, setShowFilters] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [serviceFilter, setServiceFilter] = useState("");
//   const [districtFilter, setDistrictFilter] = useState("");

//   // Dummy providers data
//   const [providers] = useState([
//     {
//       id: 1,
//       name: 'Rajesh Kumar',
//       district: 'Colombo',
//       level: 'Advanced',
//       contact: '+94 77 123 4567',
//       service: 'AC',
//       rating: 4.8,
//       reviews: 23
//     },
//     {
//       id: 2,
//       name: 'Priya Fernando',
//       district: 'Kandy',
//       level: 'Intermediate',
//       contact: '+94 77 234 5678',
//       service: 'RAC',
//       rating: 4.6,
//       reviews: 18
//     },
//     {
//       id: 3,
//       name: 'Saman Perera',
//       district: 'Galle',
//       level: 'Advanced',
//       contact: '+94 77 345 6789',
//       service: 'Electrician',
//       rating: 4.9,
//       reviews: 31
//     },
//     {
//       id: 4,
//       name: 'Nimal Jayasinghe',
//       district: 'Colombo',
//       level: 'Basic',
//       contact: '+94 77 456 7890',
//       service: 'AC',
//       rating: 4.2,
//       reviews: 12
//     },
//     {
//       id: 5,
//       name: 'Kumari Rathnayake',
//       district: 'Matara',
//       level: 'Advanced',
//       contact: '+94 77 567 8901',
//       service: 'RAC',
//       rating: 4.7,
//       reviews: 27
//     },
//     {
//       id: 6,
//       name: 'Dinesh Bandara',
//       district: 'Jaffna',
//       level: 'Intermediate',
//       contact: '+94 77 678 9012',
//       service: 'Electrician',
//       rating: 4.5,
//       reviews: 19
//     },
//     {
//       id: 7,
//       name: 'Anura Dissanayake',
//       district: 'Kurunegala',
//       level: 'Advanced',
//       contact: '+94 77 789 0123',
//       service: 'AC',
//       rating: 4.9,
//       reviews: 35
//     },
//     {
//       id: 8,
//       name: 'Chamari Gunawardena',
//       district: 'Negombo',
//       level: 'Basic',
//       contact: '+94 77 890 1234',
//       service: 'RAC',
//       rating: 4.3,
//       reviews: 14
//     }
//   ]);

//   const filteredProviders = providers.filter((p) => {
//     const matchesSearch =
//       p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.service.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesService = serviceFilter === "" || p.service === serviceFilter;
//     const matchesDistrict = districtFilter === "" || p.district === districtFilter;

//     return matchesSearch && matchesService && matchesDistrict;
//   });

//   return (
//     <div className="search-page">
//       <div className="search-container">
//         <h1 className="page-title">Find Service Providers</h1>

//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search by name, location or service"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button className="search-btn">🔍</button>
//         </div>

//         <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
//           {showFilters ? "Hide Filters" : "Show Filters"}
//         </button>

//         {showFilters && (
//           <div className="filters">
//             <select
//               value={serviceFilter}
//               onChange={(e) => setServiceFilter(e.target.value)}
//             >
//               <option value="">All Services</option>
//               <option value="AC">AC</option>
//               <option value="RAC">RAC</option>
//               <option value="Electrician">Electrician</option>
//             </select>

//             <select
//               value={districtFilter}
//               onChange={(e) => setDistrictFilter(e.target.value)}
//             >
//               <option value="">All Districts</option>
//               <option value="Colombo">Colombo</option>
//               <option value="Kandy">Kandy</option>
//               <option value="Galle">Galle</option>
//               <option value="Matara">Matara</option>
//               <option value="Jaffna">Jaffna</option>
//               <option value="Kurunegala">Kurunegala</option>
//               <option value="Negombo">Negombo</option>
//             </select>
//           </div>
//         )}

//         <div className="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>District</th>
//                 <th>Level of Course</th>
//                 <th>Contact</th>
//                 <th>Type of Service</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredProviders.length > 0 ? (
//                 filteredProviders.map((p, index) => (
//                   <tr
//                     key={index}
//                     className="provider-row"
//                     onClick={() => navigate(`/provider/${p.id}`)}
//                     style={{ cursor: 'pointer' }}
//                     title="Click to view provider details"
//                   >
//                     <td>{p.name}</td>
//                     <td>{p.district}</td>
//                     <td>{p.level}</td>
//                     <td>{p.contact}</td>
//                     <td>{p.service}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="no-results">
//                     No service providers found. Try adjusting your filters.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServiceProviderSearch;













import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Search.css";

const ServiceProviderSearch = () => {
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");

  // Fetch VERIFIED providers from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/users/providers/verified")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched providers:", data);
        setProviders(data);
      })
      .catch((error) =>
        console.error("Error fetching verified providers:", error)
      );
  }, []);

  // Filter logic
  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.district && p.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.serviceType && p.serviceType.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesService =
      serviceFilter === "" || p.serviceType === serviceFilter;

    const matchesDistrict =
      districtFilter === "" || p.district === districtFilter;

    return matchesSearch && matchesService && matchesDistrict;
  });

  return (
    <div className="search-page">
      <div className="search-container">
        <h1 className="page-title">Find Service Providers</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, location or service"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <button
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {showFilters && (
          <div className="filters">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="">All Services</option>
              <option value="AC">AC</option>
              <option value="RAC">RAC</option>
              <option value="Electrician">Electrician</option>
            </select>

            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option value="">All Districts</option>
              <option value="Colombo">Colombo</option>
              <option value="Kandy">Kandy</option>
              <option value="Galle">Galle</option>
              <option value="Matara">Matara</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Kurunegala">Kurunegala</option>
              <option value="Negombo">Negombo</option>
            </select>
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>District</th>
                <th>Level of Course</th>
                <th>Contact</th>
                <th>Type of Service</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.length > 0 ? (
                filteredProviders.map((p) => (
                  <tr
                    key={p.id}
                    className="provider-row"
                    onClick={() => navigate(`/provider/${p.id}`)}
                    style={{ cursor: "pointer" }}
                    title="Click to view provider details"
                  >
                    <td>{p.fullName}</td>
                    <td>{p.district || "N/A"}</td>
                    <td>{p.courseLevel || "N/A"}</td>
                    <td>{p.contactNumber || "N/A"}</td>
                    <td>{p.serviceType}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
                    No verified providers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderSearch;
