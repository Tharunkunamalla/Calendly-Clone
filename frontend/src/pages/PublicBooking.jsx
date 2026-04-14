import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval, isPast, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Globe, Calendar } from 'lucide-react';
import { eventTypeApi, meetingApi } from '../utils/api';
import { toast } from 'react-toastify';

const PublicBooking = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [eventType, setEventType] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchEventType();
  }, [slug]);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots();
    }
  }, [selectedDate]);

  const fetchEventType = async () => {
    try {
      const { data } = await eventTypeApi.getBySlug(slug);
      setEventType(data);
    } catch (error) {
      console.error('Event type not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const { data } = await meetingApi.getSlots(format(selectedDate, 'yyyy-MM-dd'), slug);
      setAvailableSlots(data);
    } catch (error) {
      console.error('Failed to fetch slots');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBooking(true);
    try {
      await meetingApi.book({
        inviteeName: formData.name,
        inviteeEmail: formData.email,
        startTime: selectedSlot,
        eventTypeId: eventType.id
      });
      toast.success('Event scheduled successfully!');
      navigate(`/p/${slug}/confirm?name=${formData.name}&email=${formData.email}&time=${selectedSlot}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div>Loading booking page...</div>;
  if (!eventType) return <div>Event link is invalid.</div>;

  // Calendar logic
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  return (
    <div style={{ minHeight: '100vh', padding: '4rem 2rem', background: '#f8f9fa' }}>
      <div className="card" style={{ maxWidth: showForm ? '600px' : '900px', margin: '0 auto', display: 'flex', flexDirection: showForm ? 'column' : 'row', padding: 0, overflow: 'hidden', minHeight: '600px' }}>
        
        {/* Left Side: Info */}
        <div style={{ width: showForm ? '100%' : '35%', padding: '2.5rem', borderRight: showForm ? 'none' : '1px solid var(--border)', borderBottom: showForm ? '1px solid var(--border)' : 'none' }}>
          <button onClick={() => showForm ? setShowForm(false) : navigate(-1)} style={{ background: 'none', color: 'var(--primary)', fontWeight: '600', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ChevronLeft size={20} /> Back
          </button>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Admin</h2>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1.5rem' }}>{eventType.name}</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={20} /> <span style={{ fontWeight: '600' }}>{eventType.duration} min</span>
            </div>
            {selectedSlot && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>
                <Calendar size={20} /> {format(new Date(selectedSlot), 'h:mma, EEEE, MMM do')}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Globe size={20} /> <span>UTC Timezone</span>
            </div>
          </div>
          
          {eventType.description && (
            <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>{eventType.description}</p>
          )}
        </div>

        {/* Right Side: Selection/Form */}
        <div style={{ flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
          {!showForm ? (
            <>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem' }}>Select a Date & Time</h2>
              <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
                {/* Calendar View */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontWeight: '600' }}>{format(currentMonth, 'MMMM yyyy')}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}><ChevronLeft size={18} /></button>
                      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}><ChevronRight size={18} /></button>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                      <div key={d} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', padding: '0.5rem' }}>{d}</div>
                    ))}
                    {days.map((day, i) => {
                      const isDisabled = !isSameMonth(day, currentMonth) || (isPast(day) && !isToday(day));
                      const isSelected = selectedDate && isSameDay(day, selectedDate);
                      
                      return (
                        <button 
                          key={i} 
                          disabled={isDisabled}
                          onClick={() => setSelectedDate(day)}
                          style={{
                            padding: '0.75rem 0',
                            borderRadius: '50%',
                            background: isSelected ? 'var(--primary)' : 'transparent',
                            color: isSelected ? 'white' : (isDisabled ? '#ccc' : 'var(--primary)'),
                            fontWeight: isSelected ? '700' : '600',
                            cursor: isDisabled ? 'default' : 'pointer',
                            fontSize: '0.9rem',
                            border: isSelected ? 'none' : 'none',
                            transition: 'var(--transition)'
                          }}
                          className={!isDisabled && !isSelected ? 'cal-day' : ''}
                        >
                          {format(day, 'd')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slots View */}
                {selectedDate && (
                  <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>{format(selectedDate, 'EEEE, MMM d')}</h3>
                    <div style={{ overflowY: 'auto', maxHeight: '400px', paddingRight: '0.5rem' }} className="custom-scroll">
                      {availableSlots.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No slots available</p>
                      ) : availableSlots.map(slot => (
                        <button 
                          key={slot} 
                          onClick={() => { setSelectedSlot(slot); setShowForm(true); }}
                          className="btn btn-outline" 
                          style={{ width: '100%', justifyContent: 'center', marginBottom: '0.5rem', borderRadius: '4px', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                        >
                          {format(new Date(slot), 'h:mma')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Enter Details</h2>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input 
                  type="email" 
                  className="form-input" 
                  required 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '1rem', justifyContent: 'center' }} disabled={booking}>
                {booking ? 'Booking...' : 'Schedule Event'}
              </button>
            </form>
          )}
        </div>
      </div>
      
      <style>{`
        .cal-day:hover {
          background: var(--primary-light) !important;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #eee;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default PublicBooking;
