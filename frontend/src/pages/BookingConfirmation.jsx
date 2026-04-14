import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, User, Mail, Clock } from 'lucide-react';
import { format } from 'date-fns';

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const time = searchParams.get('time');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f8f9fa' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '3rem' }}>
        <div style={{ color: '#2ecc71', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <CheckCircle size={64} />
        </div>
        
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>You are scheduled</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>A calendar invitation has been sent to your email address.</p>
        
        <div style={{ background: '#fdfdfd', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontWeight: 'bold' }}>
            <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
            <span>{time ? format(new Date(time), 'h:mma, EEEE, MMMM do, yyyy') : 'Loading...'}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Clock size={18} style={{ color: 'var(--text-muted)' }} />
            <span>UTC Timezone</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <User size={18} style={{ color: 'var(--text-muted)' }} />
            <span>{name}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Mail size={18} style={{ color: 'var(--text-muted)' }} />
            <span>{email}</span>
          </div>
        </div>

        <Link to="/" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
