import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, LayoutDashboard, Settings, Video } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Availability from './pages/Availability';
import Meetings from './pages/Meetings';
import PublicBooking from './pages/PublicBooking';
import BookingConfirmation from './pages/BookingConfirmation';
import './styles/global.css';

const Navbar = () => {
  const location = useLocation();
  const isPublicPage = location.pathname.startsWith('/p/');

  if (isPublicPage) return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="Candely" style={{ height: '32px', marginRight: '0.75rem' }} />
          <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-0.03em' }}>Candely</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Event Types</Link>
          <Link to="/meetings" className={`nav-link ${location.pathname === '/meetings' ? 'active' : ''}`}>Meetings</Link>
          <Link to="/availability" className={`nav-link ${location.pathname === '/availability' ? 'active' : ''}`}>Availability</Link>
        </div>
      </div>
      <div className="nav-right">
        <div className="avatar">
          <img src="/pfp.png" alt="Profile" />
        </div>
      </div>
      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 4rem;
          height: 80px;
          background: white;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-left {
          display: flex;
          alignItems: center;
          gap: 3rem;
        }
        .brand {
          fontSize: 1.5rem;
          fontWeight: 800;
          color: var(--primary);
          display: flex;
          alignItems: center;
          gap: 0.75rem;
          textDecoration: none;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-link {
          color: var(--text-muted);
          font-weight: 500;
          padding: 0.5rem 0;
          text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: var(--transition);
        }
        .nav-link:hover, .nav-link.active {
          color: var(--primary);
        }
        .nav-link.active {
          border-bottom-color: var(--primary);
        }
        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--primary-light);
        }
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/availability" element={<Availability />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/p/:slug" element={<PublicBooking />} />
            <Route path="/p/:slug/confirm" element={<BookingConfirmation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
