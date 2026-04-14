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
    <nav className="navbar" style={{
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#fff'
    }}>
      <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={28} /> Candely
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Event Types</Link>
          <Link to="/meetings" className={`nav-link ${location.pathname === '/meetings' ? 'active' : ''}`}>Meetings</Link>
          <Link to="/availability" className={`nav-link ${location.pathname === '/availability' ? 'active' : ''}`}>Availability</Link>
        </div>
      </div>
      <div className="nav-right">
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold' }}>
          <span style={{ margin: 'auto' }}>TK</span>
        </div>
      </div>
      <style>{`
        .nav-link {
          color: var(--text-muted);
          font-weight: 500;
          padding: 0.5rem 0;
          border-bottom: 2px solid transparent;
          transition: var(--transition);
        }
        .nav-link:hover, .nav-link.active {
          color: var(--primary);
        }
        .nav-link.active {
          border-bottom-color: var(--primary);
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
