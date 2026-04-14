import React, { useState, useEffect } from 'react';
import { 
  Plus, Settings, Copy, Trash2, ExternalLink, Users, 
  Calendar as CalendarIcon, Link as LinkIcon, Mail, 
  Share2, MoreVertical, X, Clock, Video, Globe,
  HelpCircle, ChevronDown, UserPlus, Info, ChevronUp,
  MapPin, Phone, User, MessageCircle
} from 'lucide-react';
import { eventTypeApi, meetingApi } from '../utils/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', duration: 30, description: '', color: '#006bff', location: 'Phone call' });
  const [activeTab, setActiveTab] = useState('event-types');
  const [expandedSection, setExpandedSection] = useState('duration');

  useEffect(() => {
    fetchData();
    const handleOpenNew = () => openPanel();
    window.addEventListener('open-new-event', handleOpenNew);
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('create') === 'true') {
      setTimeout(() => openPanel(), 100);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => window.removeEventListener('open-new-event', handleOpenNew);
  }, []);

  const fetchData = async () => {
    try {
      const { data: events } = await eventTypeApi.getAll();
      setEventTypes(events);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      };

      if (editingEvent) {
        await eventTypeApi.update(editingEvent.id, dataToSubmit);
        toast.success('Event updated!');
      } else {
        await eventTypeApi.create(dataToSubmit);
        toast.success('Event created!');
      }
      setShowSidePanel(false);
      fetchData();
    } catch (error) {
      toast.error('Error saving event.');
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
        color: event.color,
        location: event.location || 'Phone call'
      });
    } else {
      setEditingEvent(null);
      setFormData({ name: 'New Meeting', slug: '', duration: 30, description: '', color: '#9333ea', location: 'Phone call' });
    }
    setShowSidePanel(true);
  };

  const copyLink = (e, slug) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`);
    toast.info('Link copied!');
  };

  return (
    <div className="dashboard-root animate-fade-in">
      {/* Header Area */}
      <div className="scheduling-header">
        <div className="header-title-row">
          <h1>Scheduling</h1>
          <Info size={18} className="info-icon" />
        </div>
        <div className="tab-menu">
          <button className={`tab-item ${activeTab === 'event-types' ? 'active' : ''}`} onClick={() => setActiveTab('event-types')}>Event types</button>
          <button className="tab-item">Single-use links</button>
          <button className="tab-item">Meeting polls</button>
        </div>
      </div>

      {/* Search area */}
      <div className="search-section">
        <div className="search-container">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Search event types" />
        </div>
      </div>

      {/* Corporate branding */}
      <div className="branding-row">
        <div className="user-info">
          <div className="user-icon" style={{ background: '#006bff', color: 'white', border: 'none' }}>C</div>
          <span>Candely</span>
        </div>
      </div>

      {/* Rows */}
      <div className="event-list-fancy">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : (
          eventTypes.map((event) => (
            <div key={event.id} className="event-item-fancy" onClick={() => openPanel(event)}>
              <div className="color-strip" style={{ backgroundColor: event.color }} />
              <div className="checkbox-area">
                <input type="checkbox" onClick={e => e.stopPropagation()} />
              </div>
              <div className="event-content">
                <h3 className="event-name">{event.name}</h3>
                <div className="event-subtext">
                  <span>{event.duration} min</span>
                  <span className="dot">•</span>
                  <span>{event.location || 'Phone call'}</span>
                  <span className="dot">•</span>
                  <span>One-on-One</span>
                </div>
                <div className="event-availability">Weekdays, 9 am - 5 pm</div>
              </div>
              <div className="event-actions">
                 <a href={`/p/${event.slug}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="row-landing-link">View landing page</a>
                 <div className="hover-icons">
                    <CalendarIcon size={18} />
                    <Mail size={18} />
                    <Share2 size={18} />
                    <LinkIcon size={18} />
                 </div>
                 <button className="copy-link-btn" onClick={e => copyLink(e, event.slug)}>
                    <LinkIcon size={14} /> Copy link
                 </button>
                 <button className="icon-btn-fancy" onClick={e => { e.stopPropagation(); window.open(`/p/${event.slug}`, '_blank'); }}><ExternalLink size={18} /></button>
                 <button className="icon-btn-fancy"><MoreVertical size={18} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Premium Side Panel (3rd Image Clone) */}
      {showSidePanel && (
        <div className="side-panel-overlay" onClick={() => setShowSidePanel(false)}>
          <div className="side-panel-final" onClick={e => e.stopPropagation()}>
            <div className="panel-final-header">
              <button className="close-panel-btn" onClick={() => setShowSidePanel(false)}><X size={24} /></button>
            </div>

            <div className="panel-final-content">
              {/* Profile Header */}
              <div className="event-type-hero">
                <span className="event-hero-label">Event type</span>
                <div className="event-hero-title-box">
                  <div className="hero-color-circle" style={{ background: formData.color }} />
                  <ChevronDown size={16} color="#64748b" />
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="hero-title-input"
                  />
                </div>
                <div className="event-hero-subtitle">One-on-One</div>
              </div>

              {/* Accordion Sections */}
              <div className="panel-accordions">
                
                {/* Duration */}
                <div className="accordion-item">
                  <div className="accordion-trigger" onClick={() => setExpandedSection(expandedSection === 'duration' ? '' : 'duration')}>
                    <div className="trigger-left">
                       <h4 className="trigger-title">Duration</h4>
                       {expandedSection !== 'duration' && <div className="trigger-summary"><Clock size={16} /> {formData.duration} min</div>}
                    </div>
                    {expandedSection === 'duration' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  {expandedSection === 'duration' && (
                    <div className="accordion-body animate-fade-in">
                       <div className="duration-grid-fancy">
                         {[15, 30, 45, 60].map(m => (
                           <button key={m} type="button" onClick={() => setFormData({...formData, duration: m})}
                             className={`dur-pill ${formData.duration === m ? 'active' : ''}`}>{m} min</button>
                         ))}
                       </div>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="accordion-item">
                  <div className="accordion-trigger" onClick={() => setExpandedSection(expandedSection === 'location' ? '' : 'location')}>
                    <div className="trigger-left">
                       <h4 className="trigger-title">Location</h4>
                       {expandedSection !== 'location' && <div className="trigger-summary"><Phone size={16} /> {formData.location}</div>}
                    </div>
                    {expandedSection === 'location' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  {expandedSection === 'location' && (
                    <div className="accordion-body animate-fade-in">
                       <div className="location-grid">
                          <button className={`loc-btn ${formData.location === 'Zoom' ? 'active' : ''}`} onClick={() => setFormData({...formData, location: 'Zoom'})}>
                            <Video size={20} /> <span>Zoom</span>
                          </button>
                          <button className={`loc-btn ${formData.location === 'Phone call' ? 'active' : ''}`} onClick={() => setFormData({...formData, location: 'Phone call'})}>
                            <Phone size={20} /> <span>Phone call</span>
                          </button>
                          <button className={`loc-btn ${formData.location === 'In-person' ? 'active' : ''}`} onClick={() => setFormData({...formData, location: 'In-person'})}>
                            <MapPin size={20} /> <span>In-person</span>
                          </button>
                          <button className="loc-btn gray">
                            <ChevronDown size={20} /> <span>All options</span>
                          </button>
                       </div>
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div className="accordion-item">
                  <div className="accordion-trigger" onClick={() => setExpandedSection(expandedSection === 'availability' ? '' : 'availability')}>
                    <div className="trigger-left">
                       <h4 className="trigger-title">Availability</h4>
                       <div className="trigger-summary">Weekdays, 9 am - 5 pm</div>
                    </div>
                    <ChevronDown size={20} />
                  </div>
                </div>

                {/* Host */}
                <div className="accordion-item">
                  <div className="accordion-trigger" onClick={() => setExpandedSection(expandedSection === 'host' ? '' : 'host')}>
                    <div className="trigger-left">
                       <h4 className="trigger-title">Host</h4>
                       <div className="trigger-summary">
                          <div className="avatar-micro" style={{ background: '#006bff', color: 'white', border: 'none' }}>C</div>
                          <span>Candely (you)</span>
                       </div>
                    </div>
                    <ChevronDown size={20} />
                  </div>
                </div>

              </div>
            </div>

            <div className="panel-final-footer">
               <button className="more-options-link">More options</button>
               <button className="final-create-btn" onClick={handleSubmit}>
                 {editingEvent ? 'Save changes' : 'Create'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
