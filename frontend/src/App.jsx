import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
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

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isPublicPage = location.pathname.startsWith('/p/');

  if (isPublicPage || !user) return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.04em' }}>Candely</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Event Types</Link>
          <Link to="/meetings" className={`nav-link ${location.pathname === '/meetings' ? 'active' : ''}`}>Meetings</Link>
          <Link to="/availability" className={`nav-link ${location.pathname === '/availability' ? 'active' : ''}`}>Availability</Link>
        </div>
      </div>
      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{user.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin</div>
        </div>
        <button onClick={logout} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff4d4d', padding: '0.5rem' }}>
          <LogOut size={18} /> <span style={{ fontWeight: '600' }}>Logout</span>
        </button>
      </div>
      <style>{`
        .navbar { display: flex; justify-content: space-between; alignItems: center; padding: 0 4rem; height: 80px; background: white; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
        .nav-left { display: flex; alignItems: center; gap: 3rem; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-link { color: var(--text-muted); font-weight: 500; padding: 0.5rem 0; text-decoration: none; border-bottom: 2px solid transparent; transition: var(--transition); }
        .nav-link:hover, .nav-link.active { color: var(--primary); }
        .nav-link.active { border-bottom-color: var(--primary); }
      `}</style>
    </nav>
  );
};

const AppContent = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/availability" element={<ProtectedRoute><Availability /></ProtectedRoute>} />
          <Route path="/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
          <Route path="/p/:slug" element={<PublicBooking />} />
          <Route path="/p/:slug/confirm" element={<BookingConfirmation />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
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
