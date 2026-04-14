import React, { useState, useEffect } from 'react';
import { Plus, Settings, Copy, Trash2, ExternalLink } from 'lucide-react';
import { eventTypeApi } from '../utils/api';

const Dashboard = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newType, setNewType] = useState({ name: '', slug: '', duration: 30, description: '', color: '#006bff' });

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      const { data: events } = await eventTypeApi.getAll();
      const { data: meetings } = await meetingApi.getUpcoming();
      setEventTypes(events);
      setUpcomingCount(meetings.length);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEventType = async (e) => {
    e.preventDefault();
    try {
      await eventTypeApi.create(newType);
      setShowModal(false);
      setNewType({ name: '', slug: '', duration: 30, description: '', color: '#006bff' });
      fetchEventTypes();
    } catch (error) {
      alert('Failed to create event type. Make sure the slug is unique.');
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
          <p style={{ color: 'var(--text-muted)' }}>You have <strong>{upcomingCount}</strong> upcoming meetings scheduled.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Event Type
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading your events...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {eventTypes.map((event) => (
            <div key={event.id} className="card" style={{ borderTop: `4px solid ${event.color}`, position: 'relative' }}>
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

      {/* Create Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', animation: 'fadeIn 0.2s ease' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>New Event Type</h2>
            <form onSubmit={createEventType}>
              <div className="form-group">
                <label className="form-label">Event Name</label>
                <input type="text" className="form-input" required value={newType.name} onChange={e => setNewType({...newType, name: e.target.value})} placeholder="e.g. 30 Minute Meeting" />
              </div>
              <div className="form-group">
                <label className="form-label">URL Slug</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>candely.com/p/</span>
                  <input type="text" className="form-input" required value={newType.slug} onChange={e => setNewType({...newType, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} placeholder="meeting-link" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <select className="form-input" value={newType.duration} onChange={e => setNewType({...newType, duration: parseInt(e.target.value)})}>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                  <option value="60">60</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="3" value={newType.description} onChange={e => setNewType({...newType, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Event Color</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {['#006bff', '#1a1a1a', '#ff4f00', '#2ecc71', '#9b59b6'].map(color => (
                    <div 
                      key={color} 
                      onClick={() => setNewType({...newType, color})}
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        backgroundColor: color, 
                        cursor: 'pointer',
                        border: newType.color === color ? '3px solid #ccc' : 'none',
                        boxShadow: newType.color === color ? '0 0 0 2px white' : 'none'
                      }} 
                    />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
