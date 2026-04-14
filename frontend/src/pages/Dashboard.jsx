import React, { useState, useEffect } from 'react';
import { 
  Plus, Settings, Copy, Trash2, ExternalLink, Users, 
  Calendar as CalendarIcon, Link as LinkIcon, Mail, 
  Share2, MoreVertical, X, Clock, Video, Globe
} from 'lucide-react';
import { eventTypeApi, meetingApi } from '../utils/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', duration: 30, description: '', color: '#006bff' });

  useEffect(() => {
    fetchData();
    
    // Listen for create events from sidebar
    const handleOpenNew = () => openPanel();
    window.addEventListener('open-new-event', handleOpenNew);
    return () => window.removeEventListener('open-new-event', handleOpenNew);
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
      setShowSidePanel(false);
      setEditingEvent(null);
      setFormData({ name: '', slug: '', duration: 30, description: '', color: '#006bff' });
      fetchData();
    } catch (error) {
      toast.error('Failed to save event type. Make sure the slug is unique.');
    }
  };

  const openPanel = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        name: event.name,
        slug: event.slug,
        duration: event.duration,
        description: event.description || '',
        color: event.color
      });
    } else {
      setEditingEvent(null);
      setFormData({ name: '', slug: '', duration: 30, description: '', color: '#006bff' });
    }
    setShowSidePanel(true);
  };

  const copyLink = (e, slug) => {
    e.stopPropagation();
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    toast.info('Link copied to clipboard!');
  };

  const deleteEventType = async (e, id) => {
    e.stopPropagation();
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
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Event Types</h1>
          <button className="btn btn-primary" onClick={() => openPanel()} style={{ borderRadius: '100px', padding: '0.75rem 1.5rem' }}>
            <Plus size={20} /> New Event Type
          </button>
        </div>
        <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <div className="avatar-small" style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}>A</div> 
             User: <strong>Admin</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={16} /> <strong>{upcomingCount}</strong> Upcoming meetings
          </span>
        </div>
      </header>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      ) : eventTypes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', border: '2px dashed var(--border)', borderRadius: '16px' }}>
          <h2 style={{ marginBottom: '1rem' }}>No event types yet</h2>
          <button className="btn btn-primary" onClick={() => openPanel()}>Create your first event</button>
        </div>
      ) : (
        <div className="event-list">
          {eventTypes.map((event) => (
            <div key={event.id} className="event-row" onClick={() => openPanel(event)}>
              <div className="event-row-indicator" style={{ background: event.color }} />
              <div className="event-row-info">
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{event.name}</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span>{event.duration} min</span>
                  <span>•</span>
                  <span>One-on-One</span>
                  <span>•</span>
                  <a href={`/p/${event.slug}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>View landing page</a>
                </div>
              </div>
              <div className="event-row-actions">
                <div className="row-icon-group">
                  <CalendarIcon size={18} />
                  <Mail size={18} />
                  <Share2 size={18} />
                  <LinkIcon size={18} />
                </div>
                <button className="btn btn-outline" onClick={(e) => copyLink(e, event.slug)} style={{ borderRadius: '100px', fontSize: '0.85rem' }}>
                  <Copy size={16} /> Copy link
                </button>
                <div style={{ position: 'relative' }}>
                  <button className="btn btn-ghost" onClick={(e) => deleteEventType(e, event.id)} style={{ color: '#ff4d4d' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over Side Panel */}
      {showSidePanel && (
        <div className="side-panel-overlay" onClick={() => setShowSidePanel(false)}>
          <div className="side-panel" onClick={e => e.stopPropagation()}>
            <div className="side-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: formData.color }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{editingEvent ? 'Edit Event Type' : 'New Event Type'}</h2>
              </div>
              <button className="btn btn-ghost" onClick={() => setShowSidePanel(false)} style={{ padding: '0.5rem' }}>
                <X size={24} />
              </button>
            </div>
            
            <div className="side-panel-content">
               <form id="event-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div className="form-group">
                    <label className="form-label">Event Name</label>
                    <input type="text" className="form-input" required value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Discovery Call" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       {[15, 30, 45, 60].map(m => (
                          <button key={m} type="button" 
                            onClick={() => setFormData({...formData, duration: m})}
                            className={`btn ${formData.duration === m ? 'btn-primary' : 'btn-outline'}`}
                            style={{ flex: 1, padding: '0.75rem' }}
                          >
                            {m}m
                          </button>
                       ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <div className="card" style={{ padding: '1rem', background: '#f8fafc', borderStyle: 'dashed' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                          <Video size={20} /> Add a video conferencing link
                       </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL Slug</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>candely.com/p/</span>
                      <input type="text" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', fontWeight: '600' }} required 
                        value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Color</label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {['#006bff', '#1a1a1a', '#ff4f00', '#2ecc71', '#9b59b6', '#f1c40f'].map(color => (
                        <div key={color} onClick={() => setFormData({...formData, color})}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: color, cursor: 'pointer',
                            border: formData.color === color ? '3px solid white' : 'none',
                            boxShadow: formData.color === color ? '0 0 0 2px ' + color : 'none' }} />
                      ))}
                    </div>
                  </div>
               </form>
            </div>

            <div className="side-panel-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setShowSidePanel(false)}>Cancel</button>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" form="event-form" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', borderRadius: '100px' }}>
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
