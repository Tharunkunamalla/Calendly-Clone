import React, { useState, useEffect } from 'react';
import { Save, Globe, Info } from 'lucide-react';
import { availabilityApi } from '../utils/api';
import { toast } from 'react-toastify';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Availability = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const { data } = await availabilityApi.get();
      const fullSchedule = DAYS.map((day, index) => {
        const found = data.find(s => s.dayOfWeek === index);
        return found ? { ...found, enabled: true } : { dayOfWeek: index, startTime: '09:00', endTime: '17:00', enabled: false };
      });
      setSlots(fullSchedule);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSlot = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const saveAvailability = async () => {
    setSaving(true);
    try {
      const enabledSlots = slots.filter(s => s.enabled).map(s => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        timezone: 'UTC'
      }));
      await availabilityApi.updateBulk(enabledSlots);
      toast.success('Availability saved successfully!');
    } catch (error) {
      toast.error('Failed to save availability');
    } finally {
      setSaving(false);
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
          <h1 style={{ fontSize: '2rem', fontWeight: '800', tracking: '-0.02em', marginBottom: '0.5rem' }}>Availability</h1>
          <p style={{ color: 'var(--text-muted)' }}>Configure your default weekly working hours.</p>
        </div>
        <button className="btn btn-primary" onClick={saveAvailability} disabled={saving} style={{ padding: '0.8rem 2rem', borderRadius: '40px' }}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </header>

      <div className="card" style={{ maxWidth: '800px', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid var(--border)', background: '#ffffff' }}>
        <div style={{ 
          marginBottom: '2.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          color: 'var(--text-main)',
          background: 'var(--primary-light)',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--primary-light)'
        }}>
          <Globe size={20} style={{ color: 'var(--primary)' }} /> 
          <span style={{ fontWeight: '500' }}>Timezone: <span style={{ color: 'var(--primary)', fontWeight: '700' }}>UTC / Greenwich Mean Time</span></span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {slots.map((slot, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '2rem', 
              padding: '1.25rem 0', 
              borderBottom: index === slots.length - 1 ? 'none' : '1px solid var(--border)' 
            }}>
              <div style={{ width: '140px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', fontWeight: '600', fontSize: '1.05rem', color: slot.enabled ? '#1e293b' : '#94a3b8' }}>
                  <input 
                    type="checkbox" 
                    checked={slot.enabled} 
                    onChange={(e) => updateSlot(index, 'enabled', e.target.checked)}
                    style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: '#006bff' }}
                  />
                  {DAYS[slot.dayOfWeek]}
                </label>
              </div>
              
              {slot.enabled ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <input 
                    type="time" 
                    className="form-input" 
                    style={{ width: '150px', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1rem', color: '#1e293b', outline: 'none', transition: 'border-color 0.2s' }} 
                    onFocus={e => e.target.style.borderColor = '#006bff'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    value={slot.startTime}
                    onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                  />
                  <span style={{ color: '#64748b', fontWeight: '600' }}>-</span>
                  <input 
                    type="time" 
                    className="form-input" 
                    style={{ width: '150px', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '1rem', color: '#1e293b', outline: 'none', transition: 'border-color 0.2s' }} 
                    onFocus={e => e.target.style.borderColor = '#006bff'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    value={slot.endTime}
                    onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                  />
                </div>
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, fontWeight: '500' }}>
                  <Info size={16} /> Unavailable
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Availability;
