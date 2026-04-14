import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Lock, Mail } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.5rem' }}>Candely</h1>
          <p style={{ color: 'var(--text-muted)' }}>Admin Login</p>
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
                placeholder="admin@candely.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
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

          <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <p>Restricted access for authorized personnel only.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
