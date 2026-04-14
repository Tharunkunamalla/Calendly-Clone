import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Lock, Mail, ChevronDown, User as UserIcon, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@candely.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(email, password);
      login(data.token);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
      
      {/* Top minimal header */}
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#006bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>C</div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Candely</span>
        </div>
      </div>

      {/* Main Form Center */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '4rem' }}>
        <div style={{ maxWidth: '400px', width: '100%', padding: '0 1.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome back</h2>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Log in to your account to continue</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', fontSize: '0.95rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', color: '#1e293b', transition: '0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                  onFocus={e => { e.target.style.borderColor = '#006bff'; e.target.style.boxShadow = '0 0 0 3px rgba(0,107,255,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Password</label>
                <a href="#" style={{ fontSize: '0.8rem', color: '#006bff', fontWeight: '600', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', fontSize: '0.95rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', color: '#1e293b', transition: '0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                  onFocus={e => { e.target.style.borderColor = '#006bff'; e.target.style.boxShadow = '0 0 0 3px rgba(0,107,255,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ padding: '0.9rem', fontSize: '1rem', fontWeight: '700', background: '#006bff', color: 'white', borderRadius: '100px', border: 'none', cursor: 'pointer', marginTop: '0.5rem', transition: '0.2s', boxShadow: '0 4px 6px -1px rgba(0, 107, 255, 0.2)' }}
              onMouseOver={e => e.target.style.background = '#0056cc'}
              onMouseOut={e => e.target.style.background = '#006bff'}
            >
              {loading ? 'Authenticating...' : 'Log in'}
            </button>
          </form>
          
          <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: '#64748b' }}>Don't have an account? </span>
            <a href="#" style={{ color: '#006bff', fontWeight: '700', textDecoration: 'none' }}>Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
