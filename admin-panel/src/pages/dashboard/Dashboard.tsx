import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Activity,
  Calendar,
  LogOut,
  Menu,
  X,
  Search,
  Download,
  Settings,
  Bell,
  ChevronDown,
  BarChart3,
  PieChart,
  Utensils,
  Camera,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Eye,
  Shield,
  FileText,
} from "lucide-react";
import "../../styles/Dashboard.css";

interface DashboardStats {
  totalUsers: number;
  totalScans: number;
  totalMealsSaved: number;
  todayScans: number;
  activeMeals: number;
  totalCaloriesTracked: number;
  avgCaloriesPerUser: number;
  userGrowth: number;
  mealGrowth: number;
  scanGrowth: number;
}

interface MostScannedFood {
  foodName: string;
  scanCount: number;
  lastScanned: string;
}

interface RecentMeal {
  _id: string;
  userName: string;
  userEmail: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: string;
  timestamp: string;
  imageUri?: string;
  confidence?: number;
  usdaMatched?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  mealsCount: number;
  totalCalories: number;
  totalScans: number;
  joinedDate: string;
  isBlocked: boolean;
  lastActive: string;
}

interface FoodRecognitionLog {
  _id: string;
  userName: string;
  imageUri?: string;
  detectedFood: string;
  confidence: number;
  usdaMatched: string;
  timestamp: string;
  isCorrect?: boolean;
  adminOverride?: string;
}

interface Report {
  _id: string;
  userName: string;
  userEmail: string;
  type: "wrong_nutrition" | "wrong_recognition" | "bug" | "other";
  description: string;
  foodName?: string;
  timestamp: string;
  status: "pending" | "solved" | "spam";
  imageUri?: string;
}

interface AnalyticsData {
  scansPerDay: { date: string; count: number }[];
  topFoods: { name: string; count: number }[];
  avgCaloriesPerDay: number;
  mostActiveUsers: { name: string; scans: number }[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalScans: 0,
    totalMealsSaved: 0,
    todayScans: 0,
    activeMeals: 0,
    totalCaloriesTracked: 0,
    avgCaloriesPerUser: 0,
    userGrowth: 0,
    mealGrowth: 0,
    scanGrowth: 0,
  });
  const [mostScannedFoods, setMostScannedFoods] = useState<MostScannedFood[]>([]);
  const [recentMeals, setRecentMeals] = useState<RecentMeal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [recognitionLogs, setRecognitionLogs] = useState<FoodRecognitionLog[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailModal, setUserDetailModal] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterUser, setFilterUser] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        mealsRes,
        usersRes,
        logsRes,
        reportsRes,
        analyticsRes,
        mostScannedRes,
      ] = await Promise.all([
        axiosInstance.get("/admin/stats"),
        axiosInstance.get("/admin/recent-meals"),
        axiosInstance.get("/admin/users"),
        axiosInstance.get("/admin/recognition-logs"),
        axiosInstance.get("/admin/reports"),
        axiosInstance.get("/admin/analytics"),
        axiosInstance.get("/admin/most-scanned-foods"),
      ]);

      setStats(statsRes.data);
      setRecentMeals(mealsRes.data);
      setUsers(usersRes.data);
      setRecognitionLogs(logsRes.data);
      setReports(reportsRes.data);
      setAnalytics(analyticsRes.data);
      setMostScannedFoods(mostScannedRes.data);
    } catch (err) {
      console.error(err);
      if ((err as any)?.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const handleBlockUser = async (userId: string, currentStatus: boolean) => {
    try {
      await axiosInstance.patch(`/admin/users/${userId}/block`, {
        isBlocked: !currentStatus,
      });
      fetchDashboardData();
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      fetchDashboardData();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/admin/meals/${mealId}`);
      fetchDashboardData();
    } catch (err) {
      console.error("Error deleting meal:", err);
    }
  };

  const handleOverrideMapping = async (logId: string, correctMapping: string) => {
    try {
      await axiosInstance.patch(`/admin/recognition-logs/${logId}/override`, {
        correctMapping,
      });
      fetchDashboardData();
    } catch (err) {
      console.error("Error overriding mapping:", err);
    }
  };

  const handleUpdateReportStatus = async (
    reportId: string,
    status: "solved" | "spam"
  ) => {
    try {
      await axiosInstance.patch(`/admin/reports/${reportId}/status`, {
        status,
      });
      fetchDashboardData();
    } catch (err) {
      console.error("Error updating report:", err);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await axiosInstance.delete(`/admin/reports/${reportId}`);
      fetchDashboardData();
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  };

  const viewUserDetails = async (user: User) => {
    setSelectedUser(user);
    setUserDetailModal(true);
    // Fetch user's complete history
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMealTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      breakfast: "#FF9800",
      lunch: "#4CAF50",
      dinner: "#673AB7",
      snack: "#FF5722",
      dessert: "#E91E63",
    };
    return colors[type] || "#999";
  };

  const getReportTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      wrong_nutrition: "#f59e0b",
      wrong_recognition: "#ef4444",
      bug: "#8b5cf6",
      other: "#64748b",
    };
    return colors[type] || "#999";
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMeals = recentMeals.filter((meal) => {
    let matches = true;
    if (filterDate) {
      matches = matches && meal.timestamp.includes(filterDate);
    }
    if (filterUser) {
      matches =
        matches &&
        (meal.userName.toLowerCase().includes(filterUser.toLowerCase()) ||
          meal.userEmail.toLowerCase().includes(filterUser.toLowerCase()));
    }
    return matches;
  });

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-large"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Shield className="logo-icon" />
            <span className="logo-text">NutriScan</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 size={20} />
            <span>Overview</span>
          </button>
          <button
            className={`nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={20} />
            <span>Users Management</span>
          </button>
          <button
            className={`nav-item ${activeTab === "meals" ? "active" : ""}`}
            onClick={() => setActiveTab("meals")}
          >
            <Utensils size={20} />
            <span>Meals & Diary</span>
          </button>
          <button
            className={`nav-item ${
              activeTab === "recognition" ? "active" : ""
            }`}
            onClick={() => setActiveTab("recognition")}
          >
            <Camera size={20} />
            <span>Recognition Logs</span>
          </button>
          <button
            className={`nav-item ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <AlertTriangle size={20} />
            <span>Reports & Feedback</span>
          </button>
          <button
            className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <PieChart size={20} />
            <span>Analytics</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "users" && "Users Management"}
              {activeTab === "meals" && "Meals & Diary"}
              {activeTab === "recognition" && "Food Recognition Logs"}
              {activeTab === "reports" && "Reports & Feedback"}
              {activeTab === "analytics" && "Analytics"}
            </h1>
            <p className="page-subtitle">Welcome back, Admin</p>
          </div>
          <div className="topbar-right">
            <button className="icon-button">
              <Bell size={20} />
              <span className="notification-badge">{reports.filter(r => r.status === 'pending').length}</span>
            </button>
            <button className="icon-button">
              <Settings size={20} />
            </button>
            <div className="admin-profile">
              <div className="profile-avatar">A</div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="content-section">
            {/* Enhanced Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card gradient-green">
                <div className="stat-icon-container">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Users</p>
                  <h3 className="stat-value">{stats.totalUsers}</h3>
                  <div className="stat-change positive">
                    <TrendingUp size={14} />
                    <span>+{stats.userGrowth}% this month</span>
                  </div>
                </div>
              </div>

              <div className="stat-card gradient-orange">
                <div className="stat-icon-container">
                  <Camera size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Scans</p>
                  <h3 className="stat-value">{stats.totalScans}</h3>
                  <div className="stat-change positive">
                    <TrendingUp size={14} />
                    <span>+{stats.scanGrowth}% this week</span>
                  </div>
                </div>
              </div>

              <div className="stat-card gradient-purple">
                <div className="stat-icon-container">
                  <Utensils size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Meals Saved</p>
                  <h3 className="stat-value">{stats.totalMealsSaved}</h3>
                  <div className="stat-change positive">
                    <TrendingUp size={14} />
                    <span>+{stats.mealGrowth}% this week</span>
                  </div>
                </div>
              </div>

              <div className="stat-card gradient-blue">
                <div className="stat-icon-container">
                  <Clock size={24} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Today's Scans</p>
                  <h3 className="stat-value">{stats.todayScans}</h3>
                  <div className="stat-change">
                    <span>Real-time tracking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Most Scanned Foods */}
            <div className="content-card">
              <div className="card-header">
                <h2 className="card-title">Most Scanned Foods</h2>
                <button className="btn-secondary">
                  <Download size={16} />
                  Export
                </button>
              </div>
              <div className="most-scanned-grid">
                {mostScannedFoods.slice(0, 6).map((food, index) => (
                  <div key={index} className="most-scanned-item">
                    <div className="rank-badge">#{index + 1}</div>
                    <div className="food-info">
                      <h4 className="food-name">{food.foodName}</h4>
                      <p className="food-scans">{food.scanCount} scans</p>
                    </div>
                    <div className="food-date">
                      Last: {formatDate(food.lastScanned)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="content-card">
              <div className="card-header">
                <h2 className="card-title">Recent Meals</h2>
              </div>
              <div className="meals-list">
                {recentMeals.slice(0, 5).map((meal) => (
                  <div key={meal._id} className="meal-item">
                    <div className="meal-image-wrapper">
                      {meal.imageUri ? (
                        <img
                          src={meal.imageUri}
                          alt={meal.foodName}
                          className="meal-thumbnail"
                        />
                      ) : (
                        <div className="meal-placeholder">
                          <Utensils size={20} />
                        </div>
                      )}
                    </div>
                    <div className="meal-details">
                      <h4 className="meal-name">{meal.foodName}</h4>
                      <p className="meal-user">{meal.userName}</p>
                    </div>
                    <div className="meal-meta">
                      <span
                        className="meal-type-badge"
                        style={{
                          backgroundColor: getMealTypeColor(meal.mealType),
                        }}
                      >
                        {meal.mealType}
                      </span>
                      <span className="meal-calories">{meal.calories} cal</span>
                    </div>
                    <div className="meal-time">
                      <Calendar size={14} />
                      <span>{formatTime(meal.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB - Enhanced */}
        {activeTab === "users" && (
          <div className="content-section">
            <div className="content-card">
              <div className="card-header">
                <h2 className="card-title">User Management</h2>
                <div className="header-actions">
                  <div className="search-box">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="btn-secondary">
                    <Download size={16} />
                    Export
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Meals</th>
                      <th>Scans</th>
                      <th>Calories</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="user-name">{user.name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className="badge badge-blue">
                            {user.mealsCount}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-purple">
                            {user.totalScans}
                          </span>
                        </td>
                        <td>{user.totalCalories.toLocaleString()}</td>
                        <td>
                          {user.isBlocked ? (
                            <span className="badge badge-red">Blocked</span>
                          ) : (
                            <span className="badge badge-green">Active</span>
                          )}
                        </td>
                        <td>{formatDate(user.joinedDate)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon btn-view"
                              onClick={() => viewUserDetails(user)}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className={`btn-icon ${
                                user.isBlocked ? "btn-success" : "btn-warning"
                              }`}
                              onClick={() =>
                                handleBlockUser(user._id, user.isBlocked)
                              }
                              title={user.isBlocked ? "Unblock" : "Block"}
                            >
                              {user.isBlocked ? (
                                <CheckCircle size={16} />
                              ) : (
                                <XCircle size={16} />
                              )}
                            </button>
                            <button
                              className="btn-icon btn-danger"
                              onClick={() => handleDeleteUser(user._id)}
                              title="Delete User"
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
            </div>
          </div>
        )}

        {/* MEALS TAB - Enhanced with Filters */}
        {activeTab === "meals" && (
          <div className="content-section">
            <div className="content-card">
              <div className="card-header">
                <h2 className="card-title">Meals & Diary Management</h2>
                <div className="header-actions">
                  <input
                    type="date"
                    className="filter-input"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Filter by user..."
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                  />
                  <button className="btn-secondary">
                    <Download size={16} />
                    Export
                  </button>
                </div>
              </div>

              <div className="meals-grid">
                {filteredMeals.map((meal) => (
                  <div key={meal._id} className="meal-card-enhanced">
                    <div className="meal-card-image">
                      {meal.imageUri ? (
                        <img src={meal.imageUri} alt={meal.foodName} />
                      ) : (
                        <div className="meal-card-placeholder">
                          <Utensils size={32} />
                        </div>
                      )}
                      <span
                        className="meal-card-type"
                        style={{
                          backgroundColor: getMealTypeColor(meal.mealType),
                        }}
                      >
                        {meal.mealType}
                      </span>
                      {meal.confidence && (
                        <span className="confidence-badge">
                          {Math.round(meal.confidence * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="meal-card-content">
                      <h3 className="meal-card-title">{meal.foodName}</h3>
                      <p className="meal-card-user">
                        {meal.userName} • {meal.userEmail}
                      </p>
                      
                      <div className="nutrition-grid">
                        <div className="nutrition-item">
                          <span className="nutrition-label">Calories</span>
                          <span className="nutrition-value">
                            {meal.calories}
                          </span>
                        </div>
                        <div className="nutrition-item">
                          <span className="nutrition-label">Protein</span>
                          <span className="nutrition-value">{meal.protein}g</span>
                        </div>
                        <div className="nutrition-item">
                          <span className="nutrition-label">Carbs</span>
                          <span className="nutrition-value">{meal.carbs}g</span>
                        </div>
                        <div className="nutrition-item">
                          <span className="nutrition-label">Fats</span>
                          <span className="nutrition-value">{meal.fats}g</span>
                        </div>
                      </div>

                      {meal.usdaMatched && (
                        <div className="usda-match">
                          <FileText size={14} />
                          <span>USDA: {meal.usdaMatched}</span>
                        </div>
                      )}

                      <div className="meal-card-footer">
                        <span className="meal-card-date">
                          {formatDate(meal.timestamp)}
                        </span>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteMeal(meal._id)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RECOGNITION LOGS TAB */}
        {activeTab === "recognition" && (
          <div className="content-section">
            <div className="content-card">
              <div className="card-header">
                <h2 className="card-title">Food Recognition Logs</h2>
                <p className="card-subtitle">
                  Track detection accuracy and improve the model
                </p>
              </div>

              <div className="recognition-logs-list">
                {recognitionLogs.map((log) => (
                  <div key={log._id} className="recognition-log-item">
                    <div className="log-image">
                      {log.imageUri ? (
                        <img src={log.imageUri} alt={log.detectedFood} />
                      ) : (
                        <div className="log-placeholder">
                          <Camera size={24} />
                        </div>
                      )}
                    </div>

                    <div className="log-details">
                      <div className="log-header">
                        <h4 className="log-user">{log.userName}</h4>
                        <span className="log-time">
                          {formatDate(log.timestamp)} {formatTime(log.timestamp)}
                        </span>
                      </div>

                      <div className="log-detection">
                        <div className="detection-row">
                          <span className="detection-label">Detected:</span>
                          <span className="detection-value detected">
                            {log.detectedFood}
                          </span>
                          <span
                            className={`confidence-badge ${
                              log.confidence > 0.8
                                ? "high"
                                : log.confidence > 0.6
                                ? "medium"
                                : "low"
                            }`}
                          >
                            {Math.round(log.confidence * 100)}%
                          </span>
                        </div>

                        <div className="detection-row">
                          <span className="detection-label">USDA Match:</span>
                          <span className="detection-value usda">
                            {log.usdaMatched}
                          </span>
                        </div>

                        {log.adminOverride && (
                          <div className="detection-row">
                            <span className="detection-label">Override:</span>
                            <span className="detection-value override">
                              {log.adminOverride}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="log-actions">
                        <button
                          className="btn-override"
                          onClick={() => {
                            const override = prompt(
                              "Enter correct food mapping:",
                              log.usdaMatched
                            );
                            if (override) {
                              handleOverrideMapping(log._id, override);
                            }
                          }}
                        >
                          <Edit size={14} />
                          Override Mapping
                        </button>
                        
                        {log.isCorrect === undefined && (
                          <>
                            <button className="btn-correct">
                              <CheckCircle size={14} />
                              Mark Correct
                            </button>
                            <button className="btn-incorrect">
                              <XCircle size={14} />
                              Mark Wrong
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <div className="content-section">
            <div className="content-card">
              <div className="card-header">
                <h2 className="card-title">Reports & Feedback</h2>
                <div className="report-stats">
                  <span className="report-stat pending">
                    {reports.filter((r) => r.status === "pending").length} Pending
                  </span>
                  <span className="report-stat solved">
                    {reports.filter((r) => r.status === "solved").length} Solved
                  </span>
                </div>
              </div>

              <div className="reports-list">
                {reports.map((report) => (
                  <div
                    key={report._id}
                    className={`report-item status-${report.status}`}
                  >
                    <div className="report-header">
                      <div className="report-user-info">
                        <h4>{report.userName}</h4>
                        <span className="report-email">{report.userEmail}</span>
                      </div>
                      <span
                        className="report-type-badge"
                        style={{ backgroundColor: getReportTypeColor(report.type) }}
                      >
                        {report.type.replace("_", " ")}
                      </span>
                    </div>

                    <div className="report-content">
                      <p className="report-description">{report.description}</p>
                      {report.foodName && (
                        <div className="report-food">
                          <Utensils size={14} />
                          <span>Food: {report.foodName}</span>
                        </div>
                      )}
                      {report.imageUri && (
                        <img
                          src={report.imageUri}
                          alt="Report"
                          className="report-image"
                        />
                      )}
                    </div>

                    <div className="report-footer">
                      <span className="report-time">
                        {formatDate(report.timestamp)} at {formatTime(report.timestamp)}
                      </span>
                      <div className="report-actions">
                        {report.status === "pending" && (
                          <>
                            <button
                              className="btn-solve"
                              onClick={() =>
                                handleUpdateReportStatus(report._id, "solved")
                              }
                            >
                              <CheckCircle size={14} />
                              Mark Solved
                            </button>
                            <button
                              className="btn-spam"
                              onClick={() =>
                                handleUpdateReportStatus(report._id, "spam")
                              }
                            >
                              <XCircle size={14} />
                              Mark Spam
                            </button>
                          </>
                        )}
                        <button
                          className="btn-delete-report"
                          onClick={() => handleDeleteReport(report._id)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && analytics && (
          <div className="content-section">
            <div className="analytics-grid">
              {/* Top Scanned Foods Chart */}
              <div className="content-card">
                <h3 className="card-title">Top Scanned Foods</h3>
                <div className="chart-container">
                  {analytics.topFoods.map((food, index) => (
                    <div key={index} className="bar-chart-item">
                      <span className="bar-label">{food.name}</span>
                      <div className="bar-wrapper">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${
                              (food.count / analytics.topFoods[0].count) * 100
                            }%`,
                          }}
                        >
                          <span className="bar-value">{food.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scans Per Day */}
              <div className="content-card">
                <h3 className="card-title">Scans Per Day (Last 7 Days)</h3>
                <div className="chart-container">
                  {analytics.scansPerDay.map((day, index) => (
                    <div key={index} className="bar-chart-item">
                      <span className="bar-label">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </span>
                      <div className="bar-wrapper">
                        <div
                          className="bar-fill bar-blue"
                          style={{
                            width: `${
                              (day.count /
                                Math.max(...analytics.scansPerDay.map((d) => d.count))) *
                              100
                            }%`,
                          }}
                        >
                          <span className="bar-value">{day.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Average Calories */}
              <div className="content-card stat-highlight">
                <div className="stat-highlight-icon">
                  <Activity size={48} />
                </div>
                <h3 className="stat-highlight-title">Avg Calories/Day</h3>
                <h2 className="stat-highlight-value">
                  {Math.round(analytics.avgCaloriesPerDay)}
                </h2>
                <p className="stat-highlight-subtitle">From all users' diaries</p>
              </div>

              {/* Most Active Users */}
              <div className="content-card">
                <h3 className="card-title">Most Active Users</h3>
                <div className="active-users-list">
                  {analytics.mostActiveUsers.map((user, index) => (
                    <div key={index} className="active-user-item">
                      <div className="active-user-rank">#{index + 1}</div>
                      <div className="active-user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="active-user-info">
                        <h4 className="active-user-name">{user.name}</h4>
                        <p className="active-user-scans">{user.scans} scans</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* User Detail Modal */}
      {userDetailModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setUserDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button
                className="modal-close"
                onClick={() => setUserDetailModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="user-detail-info">
                <div className="user-detail-avatar">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{selectedUser.name}</h3>
                  <p>{selectedUser.email}</p>
                </div>
              </div>
              <div className="user-stats-grid">
                <div className="user-stat">
                  <span className="user-stat-label">Total Meals</span>
                  <span className="user-stat-value">
                    {selectedUser.mealsCount}
                  </span>
                </div>
                <div className="user-stat">
                  <span className="user-stat-label">Total Scans</span>
                  <span className="user-stat-value">
                    {selectedUser.totalScans}
                  </span>
                </div>
                <div className="user-stat">
                  <span className="user-stat-label">Total Calories</span>
                  <span className="user-stat-value">
                    {selectedUser.totalCalories}
                  </span>
                </div>
                <div className="user-stat">
                  <span className="user-stat-label">Joined</span>
                  <span className="user-stat-value">
                    {formatDate(selectedUser.joinedDate)}
                  </span>
                </div>
              </div>
              {/* Add user's meal history here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;