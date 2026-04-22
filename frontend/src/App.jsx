import React, {useState, useRef, useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  LogOut,
  User as UserIcon,
  Settings,
  Calendar,
  Clock,
  LayoutDashboard,
  Users,
  Link as LinkIcon,
  Briefcase,
  ChevronRight,
  HelpCircle,
  BarChart2,
  Zap,
  MessageSquare,
  ChevronLeft,
  Menu,
  Plus,
  Users2,
  Repeat,
  ChevronDown,
  UserPlus,
  Globe,
  LayoutGrid,
  Settings2,
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Availability from "./pages/Availability";
import Meetings from "./pages/Meetings";
import AdminDashboard from "./pages/AdminDashboard";
import PublicBooking from "./pages/PublicBooking";
import BookingConfirmation from "./pages/BookingConfirmation";
import LoginPage from "./pages/LoginPage";
import {AuthProvider, useAuth} from "./context/AuthContext";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";

const ProtectedRoute = ({children}) => {
  const {user, loading} = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const CreateDropdown = ({
  onClose,
  onSelectItem,
  align = "right",
  menuWidth,
}) => {
  return (
    <div
      className="create-dropdown-menu animate-fade-in"
      style={{
        position: "absolute",
        top: "calc(100% + 0.5rem)",
        ...(align === "left"
          ? {left: "0", right: "auto"}
          : {right: "0", left: "auto"}),
        width: menuWidth || "min(400px, calc(100vw - 2rem))",
        backgroundColor: "white",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        zIndex: 3000,
        padding: "0",
        overflow: "hidden",
      }}
    >
      <div style={{padding: "1rem 1.5rem 0.5rem"}}>
        <h4 style={{fontSize: "0.85rem", color: "#64748b", fontWeight: "700"}}>
          Event types
        </h4>
      </div>
      <div className="dropdown-options">
        <button
          className="create-option"
          onClick={() => onSelectItem("one-on-one")}
          style={{borderBottom: "1px solid #f1f5f9"}}
        >
          <div className="option-icon">
            <UserIcon size={24} color="#006bff" />
          </div>
          <div className="option-info">
            <strong>
              One-on-one{" "}
              <span style={{fontWeight: "normal", color: "#64748b"}}>
                1 host → 1 invitee
              </span>
            </strong>
            <p>Good for coffee chats, 1:1 interviews, etc.</p>
          </div>
        </button>
        <button
          className="create-option"
          style={{borderBottom: "1px solid #f1f5f9"}}
        >
          <div className="option-icon">
            <Users2 size={24} color="#c026d3" />
          </div>
          <div className="option-info">
            <strong>
              Group{" "}
              <span style={{fontWeight: "normal", color: "#64748b"}}>
                1 host → Multiple invitees
              </span>
            </strong>
            <p>Webinars, online classes, etc.</p>
          </div>
        </button>
        <button className="create-option">
          <div className="option-icon">
            <Repeat size={24} color="#ea580c" />
          </div>
          <div className="option-info">
            <strong>
              Round robin{" "}
              <span style={{fontWeight: "normal", color: "#64748b"}}>
                Rotating hosts → 1 invitee
              </span>
            </strong>
            <p>Distribute meetings between team members</p>
          </div>
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({collapsed, setCollapsed}) => {
  const location = useLocation();
  const {user, logout} = useAuth();
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    {icon: <LinkIcon size={20} />, label: "Scheduling", path: "/"},
    {icon: <Calendar size={20} />, label: "Meetings", path: "/meetings"},
    {icon: <Clock size={20} />, label: "Availability", path: "/availability"},
    {icon: <Users size={20} />, label: "Contacts", path: "/contacts"},
    {icon: <Zap size={20} />, label: "Workflows", path: "/workflows"},
    {
      icon: <LayoutGrid size={20} />,
      label: "Integrations & apps",
      path: "/integrations",
    },
    {icon: <Settings2 size={20} />, label: "Routing", path: "/routing"},
  ];

  return (
    <div
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      style={{borderRight: "1px solid #e2e8f0", position: "relative"}}
    >
      <div className="sidebar-header">
        <div style={{display: "flex", alignItems: "center", gap: "0.6rem"}}>
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              overflow: "hidden",
              flexShrink: 0,
              border: "1px solid #e2e8f0",
            }}
          >
            <img
              src="/pfp.png"
              alt="Profile"
              style={{width: "100%", height: "100%", objectFit: "cover"}}
            />
          </div>
          {!collapsed && (
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: "800",
                color: "#006bff",
                letterSpacing: "-0.04em",
              }}
            >
              Calendly
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(true)}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          className="sidebar-expand-btn"
          onClick={() => setCollapsed(false)}
        >
          <ChevronRight size={14} color="#64748b" />
        </button>
      )}

      <div className="sidebar-nav">
        <div
          style={{
            position: "relative",
            width: "100%",
            padding: "0 0.75rem",
            marginBottom: "1rem",
          }}
          ref={dropdownRef}
        >
          <button
            className={`sidebar-create-btn ${collapsed ? "collapsed" : ""}`}
            onClick={() => setShowCreateDropdown(!showCreateDropdown)}
          >
            <Plus size={18} /> {!collapsed && "Create"}
          </button>
          {!collapsed && showCreateDropdown && (
            <CreateDropdown
              align="left"
              menuWidth="min(400px, calc(100vw - 3rem))"
              onClose={() => setShowCreateDropdown(false)}
              onSelectItem={() => {
                setShowCreateDropdown(false);
                if (window.location.pathname !== "/")
                  window.location.href = "/?create=true";
                else window.dispatchEvent(new CustomEvent("open-new-event"));
              }}
            />
          )}
        </div>

        <div style={{marginTop: "1rem"}}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link-fancy ${location.pathname === item.path ? "active" : ""}`}
            >
              <div className="link-icon">{item.icon}</div>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>

      <div
        className="sidebar-footer"
        style={{borderTop: "none", padding: "1rem"}}
      >
        <div
          className="sidebar-link-fancy"
          style={{background: "#f8fafc", borderRadius: "8px"}}
        >
          <div className="link-icon">
            <Zap size={20} />
          </div>
          {!collapsed && <span style={{fontWeight: "700"}}>Upgrade plan</span>}
        </div>
        <div className="sidebar-link-fancy" style={{marginTop: "0.5rem"}}>
          <div className="link-icon">
            <BarChart2 size={20} />
          </div>
          {!collapsed && <span>Analytics</span>}
        </div>
        <Link
          to="/admin-center"
          className={`sidebar-link-fancy ${location.pathname === "/admin-center" ? "active" : ""}`}
        >
          <div className="link-icon">
            <UserIcon size={20} />
          </div>
          {!collapsed && <span>Admin center</span>}
        </Link>
        <div
          className="sidebar-link-fancy"
          onClick={logout}
          style={{color: "#ef4444"}}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const {user, logout} = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const clickOut = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setShowCreate(false);
    };
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  }, []);

  const handleCreate = () => {
    setShowCreate(false);
    if (window.location.pathname !== "/") {
      window.location.href = "/?create=true";
    } else {
      window.dispatchEvent(new CustomEvent("open-new-event"));
    }
  };

  return (
    <header
      className="main-header-fancy"
      style={{
        height: "70px",
        borderBottom: "1px solid #e2e8f0",
        background: "white",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 2rem",
        position: "relative",
        zIndex: 50,
      }}
    >
      <div
        className="header-actions"
        style={{display: "flex", alignItems: "center", gap: "0.85rem"}}
      >
        <button
          className="icon-btn-ghost"
          style={{background: "none", border: "none", cursor: "pointer"}}
          aria-label="Invite users"
        >
          <UserPlus size={20} color="#64748b" />
        </button>
        <div style={{position: "relative"}}>
          <button
            type="button"
            className="profile-toggle"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              padding: "0.35rem 0.45rem",
              borderRadius: "999px",
              background: "transparent",
              border: "1px solid transparent",
            }}
            onClick={() => setShowProfile(!showProfile)}
            aria-label="Open profile menu"
          >
            <div
              className="header-avatar"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid #dbe4f0",
              }}
            >
              <img
                src="/pfp.png"
                alt="Profile"
                style={{width: "100%", height: "100%", objectFit: "cover"}}
              />
            </div>
            <ChevronDown size={14} color="#64748b" />
          </button>
          {showProfile && (
            <div
              className="profile-dropdown"
              style={{
                position: "absolute",
                top: "100%",
                right: "0",
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "0.5rem 0",
                minWidth: "200px",
                boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                zIndex: 1000,
              }}
            >
              <button
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#1e293b",
                }}
              >
                <UserIcon size={16} /> Profile
              </button>
              <button
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#1e293b",
                }}
              >
                <Settings size={16} /> Account settings
              </button>
              <div
                style={{
                  height: "1px",
                  background: "#e2e8f0",
                  margin: "0.5rem 0",
                }}
              ></div>
              <button
                onClick={logout}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#ef4444",
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
        <div className="top-create-btn-group" ref={dropRef}>
          <button className="top-create-btn" onClick={handleCreate}>
            <Plus size={16} /> Create
          </button>
          <button
            className="top-create-arrow"
            onClick={() => setShowCreate(!showCreate)}
            aria-label="Open create menu"
          >
            <ChevronDown size={16} />
          </button>
          {showCreate && (
            <CreateDropdown onSelectItem={handleCreate} align="right" />
          )}
        </div>
      </div>
    </header>
  );
};

const AppContent = () => {
  const location = useLocation();
  const {user} = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isPublicPage = location.pathname.startsWith("/p/");
  const isLoginPage = location.pathname === "/login";
  const isAdminCenterPage = location.pathname.startsWith("/admin-center");
  const showSidebar =
    user && !isPublicPage && !isLoginPage && !isAdminCenterPage;

  return (
    <div className={`app-layout ${showSidebar ? "with-sidebar" : ""}`}>
      {showSidebar && (
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      )}
      <div className="main-wrapper" style={{background: "white"}}>
        {showSidebar && <Header />}
        <main
          className={`content-area`}
          style={isAdminCenterPage ? {padding: 0} : undefined}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/availability"
              element={
                <ProtectedRoute>
                  <Availability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meetings"
              element={
                <ProtectedRoute>
                  <Meetings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-center"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-center/users"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-center/groups"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/p/:slug" element={<PublicBooking />} />
            <Route path="/p/:slug/confirm" element={<BookingConfirmation />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
      <ToastContainer position="bottom-right" />
      <style>{`
        .sidebar-collapse-btn {
          width: 24px; height: 24px; border-radius: 50%; border: 1px solid #e2e8f0;
          background: white; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #64748b; transition: 0.2s;
        }
        .sidebar-collapse-btn:hover { background: #006bff; color: white; border-color: #006bff; }

        .sidebar-create-btn {
          width: 100%; padding: 0.75rem; background: white; border: 1px solid #e2e8f0; border-radius: 100px;
          display: flex; align-items: center; justify-content: center; gap: 0.75rem; 
          font-weight: 700; color: #1e293b; cursor: pointer; transition: 0.2s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .sidebar-create-btn:hover { border-color: #006bff; color: #006bff; }
        
        .sidebar-link-fancy {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1rem;
          text-decoration: none; color: #475569; font-weight: 600; font-size: 0.95rem;
          border-radius: 8px; transition: 0.2s; cursor: pointer;
        }
        .sidebar-link-fancy:hover { color: #1e293b; background: #f1f5f9; }
        .sidebar-link-fancy.active { color: #006bff; background: #eff6ff; }
        
        .header-avatar {
          width: 32px; height: 32px; background: #f1f5f9; border-radius: 50%;
          display: flex; alignItems: center; justify-content: center; font-size: 0.85rem; font-weight: 700; color: #64748b;
        }
        
        .header-actions { margin-left: auto; }
        .profile-toggle:hover { background: #f8fafc; border-color: #e2e8f0; }
        .top-create-btn-group { display: flex; align-items: stretch; height: 38px; border-radius: 100px; overflow: visible; background: #006bff; position: relative; flex-shrink: 0; }
        .top-create-btn { border: none; background: #006bff; color: white; display: flex; align-items: center; gap: 0.5rem; padding: 0 1.5rem; font-weight: 700; font-size: 0.88rem; cursor: pointer; border-right: 1px solid rgba(255,255,255,0.2); border-radius: 100px 0 0 100px; }
        .top-create-arrow { border: none; background: #006bff; color: white; padding: 0 0.75rem; display: flex; align-items: center; cursor: pointer; border-radius: 0 100px 100px 0; }
        .top-create-btn:hover, .top-create-arrow:hover { background: #0056cc; }

        .create-dropdown-menu { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      `}</style>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
