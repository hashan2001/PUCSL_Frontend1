import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  Bell,
  Mail,
} from "lucide-react";
import "../../Style/AdminDashboard.css";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    suspended: 0,
  });

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [showMessageHistory, setShowMessageHistory] = useState(false);

  // -----------------------------
  // FETCH PROVIDER STATISTICS
  // -----------------------------
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // GET all providers
        const res = await fetch("http://localhost:8080/api/users/providers");
        const providers = await res.json();

        // Count statuses
        const verifiedCount = providers.filter(
          (p) => p.status === "VERIFIED"
        ).length;

        const pendingCount = providers.filter(
          (p) => p.status === "PENDING"
        ).length;

        const suspendedCount = providers.filter(
          (p) => p.status === "SUSPENDED"
        ).length;

        setStats({
          total: providers.length,
          verified: verifiedCount,
          pending: pendingCount,
          suspended: suspendedCount,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error loading stats:", err);
        setLoading(false);
      }
    };

    fetchStats();

    // -----------------------------
    // CONTACT MESSAGE NOTIFICATIONS
    // -----------------------------
    const loadNotifications = () => {
      const messages = JSON.parse(
        localStorage.getItem("contactMessages") || "[]"
      );
      setNotifications(messages.filter((msg) => !msg.read));
      setAllMessages(messages);
    };

    loadNotifications();

    const handleStorageChange = () => loadNotifications();
    window.addEventListener("storage", handleStorageChange);

    return () =>
      window.removeEventListener("storage", handleStorageChange);
  }, []);

  const markAsRead = (id) => {
    const updatedMessages = notifications.map((msg) =>
      msg.id === id ? { ...msg, read: true } : msg
    );

    setNotifications(updatedMessages.filter((m) => !m.read));

    const all = JSON.parse(localStorage.getItem("contactMessages") || "[]");
    const updatedAll = all.map((msg) =>
      msg.id === id ? { ...msg, read: true } : msg
    );

    localStorage.setItem("contactMessages", JSON.stringify(updatedAll));
  };

  const viewMessage = (message) => {
    setShowNotifications(false);
    alert(
      `Message from ${message.name}:\n\nSubject: ${message.subject}\n\nMessage: ${message.message}`
    );
  };

  const unreadCount = notifications.length;

  const statCards = [
    {
      title: "Total Providers",
      value: stats.total,
      icon: Users,
      color: "blue",
      bgColor: "blue-bg",
    },
    {
      title: "Verified Providers",
      value: stats.verified,
      icon: CheckCircle,
      color: "green",
      bgColor: "green-bg",
    },
    {
      title: "Pending Verification",
      value: stats.pending,
      icon: AlertCircle,
      color: "yellow",
      bgColor: "yellow-bg",
    },
    {
      title: "Suspended Providers",
      value: stats.suspended,
      icon: XCircle,
      color: "red",
      bgColor: "red-bg",
    },
  ];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage service providers and system settings</p>
            </div>

            {/* ----------------------- NOTIFICATIONS ----------------------- */}
            <div className="notification-container">
              <button
                className={`notification-btn ${
                  unreadCount > 0 ? "has-notifications" : ""
                }`}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="notification-icon" />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Contact Messages</h3>
                  </div>
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="no-notifications">
                        <Mail className="no-notification-icon" />
                        <p>No new messages</p>
                      </div>
                    ) : (
                      notifications.map((msg) => (
                        <div key={msg.id} className="notification-item">
                          <div className="notification-content">
                            <div className="notification-meta">
                              <strong>{msg.name}</strong>
                              <span className="notification-time">
                                {new Date(msg.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="notification-subject">
                              {msg.subject}
                            </div>
                            <div className="notification-preview">
                              {msg.message.length > 50
                                ? `${msg.message.substring(0, 50)}...`
                                : msg.message}
                            </div>
                          </div>
                          <div className="notification-actions">
                            <button
                              className="view-message-btn"
                              onClick={() => viewMessage(msg)}
                            >
                              View Message
                            </button>
                            <button
                              className="mark-read-btn"
                              onClick={() => markAsRead(msg.id)}
                            >
                              Mark as Read
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* ----------------------- END NOTIFICATIONS ------------------- */}
          </div>
        </div>
      </header>

      <div className="container dashboard-content">
        {/* ----------------------- STATISTICS GRID ----------------------- */}
        <div className="stats-grid">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className={`stat-card ${stat.bgColor}`}>
                <div className={`stat-icon ${stat.color}`}>
                  <Icon className="icon" />
                </div>
                <h3>{stat.title}</h3>
                <p className="stat-value">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* ----------------------- MESSAGE HISTORY ----------------------- */}
        <div className="message-history-section">
          <div className="message-history-header">
            <h2>Message History</h2>
            <button
              className="toggle-history-btn"
              onClick={() => setShowMessageHistory(!showMessageHistory)}
            >
              {showMessageHistory ? "Hide History" : "Show History"}
            </button>
          </div>

          {showMessageHistory && (
            <div className="message-history-content">
              {allMessages.length === 0 ? (
                <div className="no-messages">
                  <Mail className="no-message-icon" />
                  <p>No messages in history</p>
                </div>
              ) : (
                <div className="message-list">
                  {allMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message-item ${msg.read ? "read" : "unread"}`}
                    >
                      <div className="message-content">
                        <div className="message-meta">
                          <strong>{msg.name}</strong>
                          <span className="message-time">
                            {new Date(msg.timestamp).toLocaleString()}
                          </span>
                          {!msg.read && (
                            <span className="unread-indicator">New</span>
                          )}
                        </div>
                        <div className="message-subject">{msg.subject}</div>
                        <div className="message-preview">
                          {msg.message.length > 100
                            ? `${msg.message.substring(0, 100)}...`
                            : msg.message}
                        </div>
                      </div>
                      <div className="message-actions">
                        <button
                          className="view-full-message-btn"
                          onClick={() => viewMessage(msg)}
                        >
                          View Full Message
                        </button>
                        {!msg.read && (
                          <button
                            className="mark-read-btn"
                            onClick={() => markAsRead(msg.id)}
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ----------------------- QUICK ACTIONS ----------------------- */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <a href="/providermanagement" className="action-card blue-bg-light">
              <Users className="action-icon blue" />
              <h3>Manage Providers</h3>
              <p>View, verify, edit, suspend, or delete service providers</p>
            </a>

            <a href="/addprovider" className="action-card green-bg-light">
              <CheckCircle className="action-icon green" />
              <h3>Add Provider</h3>
              <p>Register a new service provider to the marketplace</p>
            </a>

            <a href="/admindashboard" className="action-card gray-bg-light">
              <AlertCircle className="action-icon gray" />
              <h3>Dashboard Settings</h3>
              <p>View dashboard analytics and system overview</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
