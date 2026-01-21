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
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        // 1️⃣ GET LOGGED-IN PROVIDER'S ID FROM LOCALSTORAGE
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        console.log('🔍 FETCHING PROVIDER DATA FOR USER ID:', userId);

        if (!userId) {
          console.error('❌ No userId found in localStorage');
          setLoading(false);
          return;
        }

        // 2️⃣ FETCH PROVIDER DATA FROM BACKEND
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
        console.log('✅ PROVIDER DATA LOADED:', data);

        setProvider(data);

        // 3️⃣ FETCH REVIEWS - ✅ ACTIVATED!
        const reviewsResponse = await fetch(`http://localhost:8080/api/reviews/provider/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          console.log('✅ REVIEWS LOADED:', reviewsData);
          setReviews(reviewsData);
        } else {
          console.warn('⚠️ No reviews found or error fetching reviews');
          setReviews([]);
        }

        setLoading(false);

      } catch (error) {
        console.error('❌ Error fetching provider data:', error);
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
      VERIFIED: {
        bg: "badge-verified",
        text: "Verified",
        icon: Shield,
      },
      PENDING: {
        bg: "badge-pending",
        text: "Pending Review",
        icon: Calendar,
      },
      SUSPENDED: {
        bg: "badge-suspended",
        text: "Suspended",
        icon: Shield,
      },
      REJECTED: {
        bg: "badge-rejected",
        text: "Rejected",
        icon: Shield,
      },
    };
    return badges[status] || badges.PENDING;
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
              <h2>{provider.fullName || provider.full_name}</h2>
              <div className="profile-tags">
                <span className="service-type">{provider.serviceType || provider.service_type}</span>
                <span className={`status-badge ${statusBadge.bg}`}>
                  <StatusIcon className="status-icon" />
                  {statusBadge.text}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/provider/editprofile")}
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
                <p>{provider.contactNumber || provider.contact_number}</p>
              </div>
            </div>

            <div className="detail-item">
              <Award className="detail-icon" />
              <div>
                <p className="label">PUCSL Badge</p>
                <p>{provider.pucslBadgeNumber || provider.pucsl_badge_number || 'Not Assigned'}</p>
              </div>
            </div>
          </div>

          <div className="bio">
            <h3>About</h3>
            <p>{provider.bio || 'No bio available'}</p>
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
                      {review.name ? review.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <p className="review-name">{review.name || 'Anonymous'}</p>
                      <p className="review-date">
                        {review.createdAt 
                          ? new Date(review.createdAt).toLocaleDateString("en-US", { 
                              year: "numeric", 
                              month: "long", 
                              day: "numeric" 
                            })
                          : 'Date not available'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`star ${i < review.rating ? "filled" : "empty"}`}
                        fill={i < review.rating ? "#fbbf24" : "none"}
                        stroke={i < review.rating ? "#fbbf24" : "#d1d5db"}
                      />
                    ))}
                  </div>
                </div>
                <p className="review-feedback">{review.feedback || 'No feedback provided'}</p>
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
                <strong>{avgRating} ⭐</strong>
              </div>
            )}
          </div>

          <div className="visibility-card">
            <Eye className="icon" />
            <h3>Profile Visibility</h3>
            <p>
              Your profile is {provider.status === 'VERIFIED' ? 'live and visible' : 'pending verification and will be visible'} to customers searching for{" "}
              {provider.serviceType || provider.service_type} services in {provider.district}.
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