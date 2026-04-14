import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Lock, Mail, ChevronDown, User as UserIcon, ShieldInfo } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@candely.com');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('admin');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(email, password);
      login(data.token);
      toast.success('Login successful! Welcome back.');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
      {/* Left Decoration */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4rem', background: 'white', borderRight: '1px solid var(--border)' }}>
         <div style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div className="brand-logo">C</div>
              <span className="brand-text">Candely</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: 1.1, marginBottom: '2rem' }}>
              Simplify scheduling for your team.
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '400px' }}>
              The most intuitive way to manage invitations, meetings and availability in one premium place.
            </p>
         </div>
         
         <div className="card" style={{ padding: '2rem', background: 'var(--primary-light)', border: 'none' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Admin Dashboard</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--primary)', opacity: 0.8 }}>
              Manage meeting types, team availability, and analytics from your centralized portal.
            </p>
         </div>
      </div>

      {/* Right Form */}
      <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '440px', width: '100%', padding: '0 2rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Log in to your account</h2>
            <p style={{ color: 'var(--text-muted)' }}>Welcome back! Please enter your details.</p>
          </div>

          {/* Role Dropdown */}
          <div style={{ marginBottom: '2rem', position: 'relative' }}>
            <label className="form-label">Account Type</label>
            <button 
              type="button"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1rem', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {role === 'admin' ? <ShieldInfo size={18} color="var(--primary)" /> : <UserIcon size={18} />}
                <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{role} Account</span>
              </div>
              <ChevronDown size={18} />
            </button>
            {showRoleMenu && (
              <div className="card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, padding: '0.5rem', marginTop: '0.5rem', boxShadow: 'var(--shadow-md)' }}>
                <div 
                  className="dropdown-item" 
                  onClick={() => { setRole('admin'); setEmail('admin@candely.com'); setShowRoleMenu(false); }}
                >
                  <ShieldInfo size={16} /> Admin
                </div>
                <div 
                  className="dropdown-item" 
                  onClick={() => { setRole('user'); setEmail('user@example.com'); setShowRoleMenu(false); }}
                >
                  <UserIcon size={16} /> Standard User
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  style={{ paddingLeft: '40px' }}
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem', fontSize: '1rem', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          </form>
          
          <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
            <a href="#" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Start free trial</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
