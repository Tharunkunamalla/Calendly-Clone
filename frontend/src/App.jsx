import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LogOut, User as UserIcon, Settings, Calendar, Clock, 
  LayoutDashboard, Users, Link as LinkIcon, Briefcase, 
  ChevronRight, HelpCircle, BarChart2, Zap, MessageSquare,
  ChevronLeft, Menu, Plus, Users2, Repeat, ChevronDown
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

const CreateDropdown = ({ onClose, onSelectItem }) => {
  return (
    <div className="create-dropdown-menu animate-fade-in" style={{
      position: 'absolute', top: '100%', left: '1rem', width: '320px',
      backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-lg)', zIndex: 3000, padding: '1rem 0'
    }}>
      <div style={{ padding: '0 1.5rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700' }}>Event Types</h4>
      </div>
      <div className="dropdown-options">
        <button className="create-option" onClick={() => onSelectItem('one-on-one')}>
          <div className="option-icon"><UserIcon size={20} color="var(--primary)" /></div>
          <div className="option-info">
            <strong>One-on-one</strong>
            <span>1 host → 1 invitee</span>
            <p>Good for coffee chats, 1:1 interviews, etc.</p>
          </div>
        </button>
        <button className="create-option">
          <div className="option-icon"><Users2 size={20} color="#00a3ff" /></div>
          <div className="option-info">
            <strong>Group</strong>
            <span>1 host → Multiple invitees</span>
            <p>Webinars, online classes, etc.</p>
          </div>
        </button>
        <button className="create-option">
          <div className="option-icon"><Repeat size={20} color="#ff4f00" /></div>
          <div className="option-info">
            <strong>Round robin</strong>
            <span>Rotating hosts → 1 invitee</span>
            <p>Distribute meetings between team members</p>
          </div>
        </button>
      </div>
      <div style={{ borderTop: '1px solid #f1f5f9', padding: '0.5rem 0' }}>
        <button className="dropdown-sub-btn">
          <span>Admin Templates</span> <ChevronDown size={16} />
        </button>
        <button className="dropdown-sub-btn">
          <span>More ways to meet</span> <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCreateDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <div className="sidebar-nav" ref={dropdownRef}>
        <div style={{ position: 'relative', width: '100%' }}>
          <button 
            className={`create-btn premium-shadow ${collapsed ? 'collapsed' : ''}`}
            onClick={() => setShowCreateDropdown(!showCreateDropdown)}
          >
            <Plus size={20} /> {!collapsed && 'Create'}
          </button>
          {!collapsed && showCreateDropdown && (
            <CreateDropdown 
              onClose={() => setShowCreateDropdown(false)} 
              onSelectItem={() => {
                setShowCreateDropdown(false);
                // We'll trigger a custom event or use a global state to open the editor in Dashboard
                window.dispatchEvent(new CustomEvent('open-new-event'));
              }}
            />
          )}
        </div>
        
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && location.pathname === item.path && <div className="active-indicator" />}
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

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="admin-header">
      <div className="header-search">
        <div style={{ position: 'relative', width: '380px' }}>
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
                <div style={{ fontWeight: '800', fontSize: '1rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>
              <button className="dropdown-btn" onClick={() => { setShowDropdown(false); logout(); }}>
                <LogOut size={16} /> Logout
              </button>
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isPublicPage = location.pathname.startsWith('/p/');
  const isLoginPage = location.pathname === '/login';

  const showSidebar = user && !isPublicPage && !isLoginPage;

  return (
    <div className={`app-layout ${showSidebar ? 'with-sidebar' : ''}`}>
      {showSidebar && <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />}
      <div className="main-wrapper">
        {showSidebar && <Header />}
        <main className={`content-area ${showSidebar && sidebarCollapsed ? 'expanded' : ''}`}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/availability" element={<ProtectedRoute><Availability /></ProtectedRoute>} />
            <Route path="/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
            <Route path="/contacts" element={<ProtectedRoute><EmptyState title="Contacts" /></ProtectedRoute>} />
            <Route path="/workflows" element={<ProtectedRoute><EmptyState title="Workflows" /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><EmptyState title="Analytics" /></ProtectedRoute>} />
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

const EmptyState = ({ title }) => (
  <div className="animate-fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '5rem 3rem' }}>
      <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
        <Zap size={40} />
      </div>
      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>{title} is coming soon</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>We're building something amazing to help you manage your scheduling workflow better.</p>
    </div>
  </div>
);

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
