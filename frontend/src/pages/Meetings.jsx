import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, User, Mail, XCircle, Clock, ChevronRight } from 'lucide-react';
import { meetingApi } from '../utils/api';
import { toast } from 'react-toastify';

const Meetings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, [activeTab]);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const response = activeTab === 'upcoming' 
        ? await meetingApi.getUpcoming() 
        : await meetingApi.getPast();
      setMeetings(response.data);
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelMeeting = async (id) => {
    if (window.confirm('Are you sure you want to cancel this meeting?')) {
      try {
        await meetingApi.cancel(id);
        toast.info('Meeting cancelled');
        fetchMeetings();
      } catch (error) {
        toast.error('Failed to cancel meeting');
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ background: '#fff' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Scheduled Events</h1>
        <p style={{ color: 'var(--text-muted)' }}>View and manage your upcoming and past bookings.</p>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          style={{ padding: '0.5rem 1.5rem', borderRadius: '30px', fontWeight: '600', transition: 'all 0.2s', background: activeTab === 'upcoming' ? '#e0f2fe' : 'transparent', color: activeTab === 'upcoming' ? '#006bff' : '#64748b', border: 'none', cursor: 'pointer' }}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          style={{ padding: '0.5rem 1.5rem', borderRadius: '30px', fontWeight: '600', transition: 'all 0.2s', background: activeTab === 'past' ? '#e0f2fe' : 'transparent', color: activeTab === 'past' ? '#006bff' : '#64748b', border: 'none', cursor: 'pointer' }}
        >
          Past
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading meetings...</div>
      ) : meetings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem', border: '1px solid var(--border)', borderRadius: '12px', background: '#fafafa' }}>
          <Calendar size={48} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No {activeTab} meetings</h2>
          <p style={{ color: 'var(--text-muted)' }}>When people book time with you, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {meetings.map((meeting) => (
            <div key={meeting.id} className="card" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1.5rem 2rem'
            }}>
              <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', minWidth: '60px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>
                    {format(new Date(meeting.startTime), 'MMM')}
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1a1a1a' }}>
                    {format(new Date(meeting.startTime), 'dd')}
                  </div>
                </div>
                
                <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '2.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: meeting.eventType?.color || 'var(--primary)' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{meeting.eventType?.name}</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} /> {format(new Date(meeting.startTime), 'h:mma')} - {format(new Date(meeting.endTime), 'h:mma')}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={16} /> {meeting.inviteeName}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={16} /> {meeting.inviteeEmail}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {activeTab === 'upcoming' && meeting.status === 'confirmed' && (
                  <button onClick={() => cancelMeeting(meeting.id)} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', background: '#fee2e2', color: '#ef4444', fontWeight: '600', border: '1px solid #fca5a5', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.target.style.background = '#fecaca'} onMouseOut={e => e.target.style.background = '#fee2e2'}>
                     Cancel Meeting
                  </button>
                )}
                {meeting.status === 'cancelled' && (
                  <span style={{ color: '#ff4d4d', fontWeight: '800', fontSize: '0.75rem', tracking: '0.1em', background: '#fff0f0', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>CANCELLED</span>
                )}
                <ChevronRight size={20} style={{ color: '#e2e5e9' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Meetings;
