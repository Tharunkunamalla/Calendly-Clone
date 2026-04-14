import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LogOut, User as UserIcon, Settings, Calendar, Clock, 
  LayoutDashboard, Users, Link as LinkIcon, Briefcase, 
  ChevronRight, HelpCircle, BarChart2, Zap, MessageSquare
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Availability from './pages/Availability';
import Meetings from './pages/Meetings';
import PublicBooking from './pages/PublicBooking';
import BookingConfirmation from './pages/BookingConfirmation';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Event Types', path: '/' },
    { icon: <Calendar size={20} />, label: 'Meetings', path: '/meetings' },
    { icon: <Clock size={20} />, label: 'Availability', path: '/availability' },
    { icon: <Users size={20} />, label: 'Contacts', path: '/contacts' },
    { icon: <Zap size={20} />, label: 'Workflows', path: '/workflows' },
    { icon: <BarChart2 size={20} />, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand" style={{ gap: '0.75rem' }}>
          <div className="brand-logo">C</div>
          {!collapsed && <span className="brand-text">Candely</span>}
        </div>
      </div>
      
      <div className="sidebar-nav">
        <button className="create-btn">
          <Plus size={20} /> {!collapsed && 'Create'}
        </button>
        
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-link" onClick={logout} style={{ color: '#ff4d4d', cursor: 'pointer' }}>
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
};

// Simplified Plus icon since I didn't import it in Sidebar scope
const Plus = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="admin-header">
      <div className="header-search">
        <div style={{ position: 'relative', width: '300px' }}>
          <input type="text" placeholder="Search event types" className="search-input" />
        </div>
      </div>
      <div className="header-actions">
        <button className="icon-btn-ghost"><HelpCircle size={20} /></button>
        <div className="profile-section">
          <button className="profile-trigger" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="avatar-small">{user?.name?.charAt(0)}</div>
          </button>
          {showDropdown && (
            <div className="profile-dropdown animate-fade-in">
              <div className="dropdown-header">
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
              </div>
              <button className="dropdown-btn" onClick={logout}><LogOut size={16} /> Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isPublicPage = location.pathname.startsWith('/p/');
  const isLoginPage = location.pathname === '/login';

  const showSidebar = user && !isPublicPage && !isLoginPage;

  return (
    <div className={`app-layout ${showSidebar ? 'with-sidebar' : ''}`}>
      {showSidebar && <Sidebar />}
      <div className="main-wrapper">
        {showSidebar && <Header />}
        <main className="content-area">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/availability" element={<ProtectedRoute><Availability /></ProtectedRoute>} />
            <Route path="/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
            {/* Added placeholders for other routes */}
            <Route path="/contacts" element={<ProtectedRoute><div className="card">Contacts Feature Coming Soon</div></ProtectedRoute>} />
            <Route path="/workflows" element={<ProtectedRoute><div className="card">Workflows Feature Coming Soon</div></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><div className="card">Analytics Feature Coming Soon</div></ProtectedRoute>} />
            
            <Route path="/p/:slug" element={<PublicBooking />} />
            <Route path="/p/:slug/confirm" element={<BookingConfirmation />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
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
