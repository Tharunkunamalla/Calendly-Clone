import React, { useState, useEffect } from 'react';
import { format, isAfter } from 'date-fns';
import { Calendar, User, Mail, XCircle } from 'lucide-react';
import { meetingApi } from '../utils/api';

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
        fetchMeetings();
      } catch (error) {
        alert('Failed to cancel meeting');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Meetings</h1>
          <p style={{ color: 'var(--text-muted)' }}>View and manage your scheduled appointments.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => setActiveTab('upcoming')}
          style={{ 
            padding: '1rem 0', 
            background: 'none', 
            borderBottom: activeTab === 'upcoming' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'upcoming' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: '600'
          }}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          style={{ 
            padding: '1rem 0', 
            background: 'none', 
            borderBottom: activeTab === 'past' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'past' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: '600'
          }}
        >
          Past
        </button>
      </div>

      {loading ? (
        <p>Loading meetings...</p>
      ) : meetings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>No {activeTab} meetings found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {meetings.map((meeting) => (
            <div key={meeting.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ width: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase' }}>
                    {format(new Date(meeting.startTime), 'MMM')}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {format(new Date(meeting.startTime), 'dd')}
                  </div>
                </div>
                
                <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{meeting.eventType.name}</h3>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} /> {format(new Date(meeting.startTime), 'EEEE, MMMM do')}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <User size={14} /> {meeting.inviteeName}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={14} /> {meeting.inviteeEmail}
                    </span>
                  </div>
                </div>
              </div>

              {activeTab === 'upcoming' && meeting.status === 'confirmed' && (
                <button className="btn btn-ghost" onClick={() => cancelMeeting(meeting.id)} style={{ color: '#ff4d4d' }}>
                  <XCircle size={18} /> Cancel
                </button>
              )}
              {meeting.status === 'cancelled' && (
                <span style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '0.875rem' }}>CANCELLED</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Meetings;
