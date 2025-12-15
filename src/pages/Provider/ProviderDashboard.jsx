import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Phone,
  MapPin,
  Shield,
  Star,
  TrendingUp,
  MessageSquare,
  Calendar,
  Award,
  Eye,
} from "lucide-react";
import "../../style/ProviderDashboard.css";

export const ProviderDashboard = () => {
  const navigate = useNavigate();

  // 🔹 Mock provider data
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = () => {
      try {
        // Dummy provider data for demonstration
        const dummyProvider = {
          id: 1,
          full_name: 'Rajesh Kumar',
          service_type: 'AC',
          district: 'Colombo',
          address: '123 Main Street, Colombo 01',
          contact_number: '+94 77 123 4567',
          pucsl_badge_number: 'PUCSL-AC-2024-001',
          bio: 'Experienced AC technician with 8+ years in installation and repair. Certified by PUCSL with advanced training in modern cooling systems.',
          status: 'verified',
          email: 'rajesh@example.com'
        };

        setProvider(dummyProvider);

        // Dummy reviews data
        setReviews([
          {
            id: 1,
            customer_name: "John Doe",
            rating: 5,
            feedback: "Excellent service! Rajesh was professional, punctual, and fixed my AC in no time. Highly recommended.",
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            customer_name: "Jane Smith",
            rating: 4,
            feedback: "Good work on my refrigerator repair. Took a bit longer than expected but the quality was good.",
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 3,
            customer_name: "Michael Chen",
            rating: 5,
            feedback: "Very satisfied with the electrical installation. Explained everything clearly and followed safety protocols.",
            created_at: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: 4,
            customer_name: "Priya Kumar",
            rating: 4,
            feedback: "Professional service for AC maintenance. Would definitely call again for future services.",
            created_at: new Date(Date.now() - 259200000).toISOString()
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching provider data:', error);
        setLoading(false);
      }
    };
    fetchProviderData();
  }, []);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getStatusBadge = (status) => {
    const badges = {
      verified: {
        bg: "badge-verified",
        text: "Verified",
        icon: Shield,
      },
      pending: {
        bg: "badge-pending",
        text: "Pending Review",
        icon: Calendar,
      },
      suspended: {
        bg: "badge-suspended",
        text: "Suspended",
        icon: Shield,
      },
      rejected: {
        bg: "badge-rejected",
        text: "Rejected",
        icon: Shield,
      },
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">
          <Shield className="error-icon-svg" />
        </div>
        <h2>Provider Profile Not Found</h2>
        <p>Please contact PUCSL admin for assistance.</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  const statusBadge = getStatusBadge(provider.status);
  const avgRating = calculateAverageRating();
  const StatusIcon = statusBadge.icon;

  return (
    <div className="provider-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-icon">
          <Shield className="icon" />
        </div>
        <div>
          <h1>Provider Dashboard</h1>
          <p>Manage your profile and view customer feedback</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <section className="profile-card">
          <div className="profile-header">
            <div>
              <h2>{provider.full_name}</h2>
              <div className="profile-tags">
                <span className="service-type">{provider.service_type}</span>
                <span className={`status-badge ${statusBadge.bg}`}>
                  <StatusIcon className="status-icon" />
                  {statusBadge.text}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/provider/edit")}
              className="edit-btn"
            >
              <Edit className="icon" />
              Edit Profile
            </button>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <MapPin className="detail-icon" />
              <div>
                <p className="label">Location</p>
                <p>{provider.district}</p>
                <p className="sub">{provider.address}</p>
              </div>
            </div>

            <div className="detail-item">
              <Phone className="detail-icon" />
              <div>
                <p className="label">Contact</p>
                <p>{provider.contact_number}</p>
              </div>
            </div>

            <div className="detail-item">
              <Award className="detail-icon" />
              <div>
                <p className="label">PUCSL Badge</p>
                <p>{provider.pucsl_badge_number}</p>
              </div>
            </div>
          </div>

          <div className="bio">
            <h3>About</h3>
            <p>{provider.bio}</p>
          </div>
        </section>

        <section className="reviews-section">
          <div className="section-header">
            <MessageSquare className="icon" />
            <div>
              <h2>Customer Reviews</h2>
              <p>Feedback from your customers</p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="no-reviews">
              <MessageSquare className="no-review-icon" />
              <p>No reviews yet</p>
              <span>Reviews will appear once customers leave feedback.</span>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="review-user">
                    <div className="review-avatar">
                      {review.customer_name.charAt(0)}
                    </div>
                    <div>
                      <p className="review-name">{review.customer_name}</p>
                      <p className="review-date">
                        {new Date(review.created_at).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`star ${
                          i < review.rating ? "filled" : "empty"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="review-feedback">{review.feedback}</p>
              </div>
            ))
          )}
        </section>

        <aside className="sidebar">
          <div className="stats-card">
            <div className="stats-header">
              <TrendingUp className="icon" />
              <div>
                <h3>Profile Statistics</h3>
                <p>Your performance metrics</p>
              </div>
            </div>
            <div className="stat">
              <MessageSquare className="icon small" />
              <span>Total Reviews</span>
              <strong>{reviews.length}</strong>
            </div>
            {reviews.length > 0 && (
              <div className="stat">
                <Star className="icon small" />
                <span>Average Rating</span>
                <strong>{avgRating}</strong>
              </div>
            )}
          </div>

          <div className="visibility-card">
            <Eye className="icon" />
            <h3>Profile Visibility</h3>
            <p>
              Your profile is live and visible to customers searching for{" "}
              {provider.service_type} services in {provider.district}.
            </p>
            <button
              onClick={() => navigate(`/provider/${provider.id}`)}
              className="view-btn"
            >
              View Public Profile
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};
export default ProviderDashboard;