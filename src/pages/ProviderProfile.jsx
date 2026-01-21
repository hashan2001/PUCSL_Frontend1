import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Phone, Shield, Star, ArrowLeft, MessageSquare } from "lucide-react";
import "../Style/ProviderProfile.css"; 

const ProviderProfile = () => {
    // Retrieves the provider ID from the URL path (e.g., /profile/123)
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [provider, setProvider] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loadingProvider, setLoadingProvider] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        rating: 5,
        feedback: "",
    });

    // Fetches the ID of the current logged-in user (the reviewer)
    const currentUserId = Number(localStorage.getItem("userId")) || null;

    // --- 1. FETCH PROVIDER DETAILS ---
    useEffect(() => {
        setLoadingProvider(true);
        // Assuming your user/provider details endpoint is at /api/users/{id}
        fetch(`http://localhost:8080/api/users/${id}`)
            .then((res) => {
                // Handle 404/500 errors explicitly
                if (!res.ok) throw new Error(`Failed to fetch provider: ${res.status}`);
                return res.json();
            })
            .then((data) => setProvider(data))
            .catch((err) => {
                console.error("Provider load error:", err);
                setProvider(null);
            })
            .finally(() => setLoadingProvider(false));
    }, [id]);

    // --- 2. FETCH REVIEWS ONLY FOR THIS PROVIDER ---
    // Calls the backend endpoint: GET /api/reviews/provider/{providerId}
    useEffect(() => {
        setLoadingReviews(true);

        fetch(`http://localhost:8080/api/reviews/provider/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch reviews.");
                return res.json();
            })
            .then((data) => setReviews(Array.isArray(data) ? data : []))
            .catch((err) => {
                console.error("Reviews fetch error:", err);
                setReviews([]);
            })
            .finally(() => setLoadingReviews(false));
    }, [id]);

    // --- 3. AVERAGE RATING CALCULATION ---
    const averageRating = () => {
        if (!reviews.length) return 0;
        const sum = reviews.reduce((acc, r) => acc + Number(r.rating), 0);
        return (sum / reviews.length).toFixed(1);
    };

    // --- 4. SUBMIT REVIEW (POST request) ---
    const submitReview = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!form.name || !form.feedback) {
            alert("Name and feedback are required.");
            return;
        }

        // ✅ GET TOKEN FROM LOCALSTORAGE
        const token = localStorage.getItem("token");

        if (!token) {
            alert("⚠️ Please login to submit a review.");
            return;
        }

        // Payload matches the updated ReviewDTO on the backend
        const payload = {
            userId: currentUserId,   // customer ID (reviewer)
            providerId: Number(id),  // provider being reviewed
            name: form.name,
            email: form.email,
            rating: form.rating,
            feedback: form.feedback,
        };

        try {
            const res = await fetch("http://localhost:8080/api/reviews", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // ✅ Send token from localStorage
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Review submission failed: ${res.status} - ${errorText}`);
            }

            const created = await res.json();
            // Prepend the new review to the list
            setReviews((prev) => [created, ...prev]);

            // Reset form and close it
            setForm({ name: "", email: "", rating: 5, feedback: "" });
            setShowReviewForm(false);

            alert("✅ Thanks! Your review has been submitted.");
        } catch (err) {
            console.error("Submit review error:", err);
            alert(`❌ Cannot submit review: ${err.message}`);
        }
    };

    // --- UI RENDER ---
    if (loadingProvider) return <div className="provider-loading">Loading provider...</div>;

    if (!provider)
        return (
            <div className="provider-loading">
                Provider not found.
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );

    return (
        <div className="provider-page">
            <div className="provider-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Back
                </button>
            </div>

            <div className="provider-container">
                {/* Provider Details */}
                <div className="provider-details">
                    <h1>{provider.fullName}</h1>
                    <p className="service-type">{provider.serviceType}</p>

                    <div className="info-section">
                        <p>
                            <MapPin size={18} /> {provider.address}, {provider.district}
                        </p>
                        <p>
                            <Phone size={18} /> {provider.contactNumber}
                        </p>
                        {provider.pucslBadgeNumber && (
                            <p>
                                <Shield size={18} /> Verified – {provider.pucslBadgeNumber}
                            </p>
                        )}
                    </div>

                    <p className="bio">{provider.bio}</p>

                    <div className="rating-section">
                        <Star size={20} className="star-icon" />
                        <span className="avg-rating">{averageRating()}</span>
                        <span>({reviews.length} reviews)</span>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="review-section">
                    <div className="review-header">
                        <h2>Customer Reviews</h2>
                        <button className="review-btn" onClick={() => setShowReviewForm(!showReviewForm)}>
                            <MessageSquare size={16} /> Write a Review
                        </button>
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                        <form className="review-form" onSubmit={submitReview}>
                            <input
                                type="text"
                                placeholder="Your Name *"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />

                            <div className="rating-input">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={20}
                                        className={s <= form.rating ? "filled" : ""}
                                        onClick={() => setForm({ ...form, rating: s })}
                                    />
                                ))}
                            </div>

                            <textarea
                                placeholder="Your Review *"
                                required
                                rows={4}
                                value={form.feedback}
                                onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                            />

                            <button type="submit" className="submit-btn">
                                Submit Review
                            </button>
                        </form>
                    )}

                    {/* Review List */}
                    <div className="reviews-list">
                        {loadingReviews ? (
                            <p>Loading reviews...</p>
                        ) : reviews.length === 0 ? (
                            <p>No reviews yet. Be the first!</p>
                        ) : (
                            reviews.map((r) => (
                                <div className="review-card" key={r.id}>
                                    <div className="review-top">
                                        <strong>{r.name}</strong>
                                        <div className="stars">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={14} className={s <= r.rating ? "filled" : ""} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="review-text">{r.feedback}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderProfile;