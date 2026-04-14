import React, { useState, useEffect } from 'react';
import { Plus, Settings, Copy, Trash2, ExternalLink, Users, Calendar as CalendarIcon } from 'lucide-react';
import { eventTypeApi, meetingApi } from '../utils/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', duration: 30, description: '', color: '#006bff' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await eventTypeApi.update(editingEvent.id, formData);
        toast.success('Event type updated!');
      } else {
        await eventTypeApi.create(formData);
        toast.success('Event type created successfully!');
      }
      setShowModal(false);
      setEditingEvent(null);
      setFormData({ name: '', slug: '', duration: 30, description: '', color: '#006bff' });
      fetchData();
    } catch (error) {
      toast.error('Failed to save event type. Make sure the slug is unique.');
    }
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      slug: event.slug,
      duration: event.duration,
      description: event.description || '',
      color: event.color
    });
    setShowModal(true);
  };

  const copyLink = (slug) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    toast.info('Link copied to clipboard!');
  };

  const deleteEventType = async (id) => {
    if (window.confirm('Are you sure you want to delete this event type?')) {
      try {
        await eventTypeApi.delete(id);
        toast.success('Event type deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete event type');
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ background: '#fff' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '3rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border)'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', tracking: '-0.02em', marginBottom: '0.5rem' }}>Event Types</h1>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} /> User: <strong>Default Admin</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarIcon size={16} /> <strong>{upcomingCount}</strong> Upcoming meetings
            </span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ padding: '0.8rem 1.5rem', borderRadius: '40px' }}>
          <Plus size={20} /> New Event Type
        </button>
      </header>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading your dashboard...</div>
      ) : eventTypes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', border: '2px dashed var(--border)', borderRadius: '12px' }}>
          <h2 style={{ marginBottom: '1rem' }}>No event types yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Create your first event type to start scheduling meetings.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Create your first event</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {eventTypes.map((event) => (
            <div key={event.id} className="card" style={{ 
              padding: 0, 
              overflow: 'hidden', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderColor: 'var(--border)'
            }}>
              <div style={{ height: '8px', background: event.color }} />
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                  <button 
                    onClick={() => openEdit(event)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--text-muted)' }}
                    title="Edit Event"
                  >
                    <Settings size={18} />
                  </button>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{event.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  {event.duration} mins, One-on-One
                </p>
                <a 
                  href={`/p/${event.slug}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                >
                  View booking page <ExternalLink size={14} />
                </a>
              </div>
              
              <div style={{ 
                background: '#fafbfb', 
                padding: '1rem 1.5rem', 
                borderTop: '1px solid var(--border)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <button className="btn btn-ghost" onClick={() => copyLink(event.slug)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  <Copy size={16} /> Copy link
                </button>
                <button className="btn btn-ghost" onClick={() => deleteEventType(event.id)} style={{ color: '#ff4d4d', padding: '0.4rem' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Centered Modal */}
      {showModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="card" style={{ 
            width: '100%', maxWidth: '520px', borderRadius: '12px', padding: '2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>
              {editingEvent ? 'Edit Event Type' : 'New Event Type'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Event Name</label>
                <input type="text" className="form-input" required value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Discovery Call" />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">URL Slug</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.6rem 0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>/p/</span>
                  <input type="text" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }} required 
                    value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} placeholder="meeting-link" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Duration</label>
                  <select className="form-input" value={formData.duration} onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}>
                    <option value="15">15 mins</option>
                    <option value="30">30 mins</option>
                    <option value="60">60 mins</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Color Theme</label>
                  <div style={{ display: 'flex', gap: '0.5rem', height: '40px', alignItems: 'center' }}>
                    {['#006bff', '#1a1a1a', '#ff4f00', '#2ecc71', '#9b59b6'].map(color => (
                      <div key={color} onClick={() => setFormData({...formData, color})}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: color, cursor: 'pointer',
                          border: formData.color === color ? '2px solid #fff' : 'none',
                          boxShadow: formData.color === color ? '0 0 0 2px ' + color : 'none' }} />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => { setShowModal(false); setEditingEvent(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 2rem' }}>
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
