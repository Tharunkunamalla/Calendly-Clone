import React, { useState, useEffect } from 'react';
import { Plus, Settings, Copy, Trash2, ExternalLink } from 'lucide-react';
import { eventTypeApi } from '../utils/api';

const Dashboard = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      const { data } = await eventTypeApi.getAll();
      setEventTypes(data);
    } catch (error) {
      console.error('Failed to fetch event types:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (slug) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const deleteEventType = async (id) => {
    if (window.confirm('Are you sure you want to delete this event type?')) {
      try {
        await eventTypeApi.delete(id);
        fetchEventTypes();
      } catch (error) {
        alert('Failed to delete event type');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Event Types</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your scheduling links and settings.</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Feature coming soon: Use the UI to create!')}>
          <Plus size={18} /> New Event Type
        </button>
      </div>

      {loading ? (
        <p>Loading your events...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {eventTypes.map((event) => (
            <div key={event.id} className="card" style={{ borderTop: `4px solid ${event.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px' }} defaultChecked />
                <Settings size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{event.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {event.duration} mins, One-on-One
              </p>
              <a 
                href={`/p/${event.slug}`} 
                target="_blank" 
                rel="noreferrer"
                style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem' }}
              >
                view booking page <ExternalLink size={14} />
              </a>
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button className="btn btn-ghost" onClick={() => copyLink(event.slug)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                  <Copy size={14} /> Copy link
                </button>
                <button className="btn btn-ghost" onClick={() => deleteEventType(event.id)} style={{ color: '#ff4d4d' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
