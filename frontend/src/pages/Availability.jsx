import React, { useState, useEffect } from 'react';
import { Save, Globe } from 'lucide-react';
import { availabilityApi } from '../utils/api';

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
      // Initialize all days if some are missing
      const fullSchedule = DAYS.map((day, index) => {
        const found = data.find(s => s.dayOfWeek === index);
        return found || { dayOfWeek: index, startTime: '09:00', endTime: '17:00', enabled: false };
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
      // Filter only enabled slots for the backend
      const enabledSlots = slots.filter(s => s.enabled || s.id).map(s => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        timezone: 'UTC'
      }));
      await availabilityApi.updateBulk(enabledSlots);
      alert('Availability saved successfully!');
    } catch (error) {
      alert('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Availability</h1>
          <p style={{ color: 'var(--text-muted)' }}>Configure when you are available for meetings.</p>
        </div>
        <button className="btn btn-primary" onClick={saveAvailability} disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="card">
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <Globe size={18} /> <span>Timezone: <strong>UTC / Greenwich Mean Time</strong></span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {slots.map((slot, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '120px', fontWeight: '600' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={slot.enabled || !!slot.id} 
                    onChange={(e) => updateSlot(index, 'enabled', e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  {DAYS[slot.dayOfWeek]}
                </label>
              </div>
              
              {(slot.enabled || slot.id) ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input 
                    type="time" 
                    className="form-input" 
                    style={{ width: '130px', padding: '0.5rem' }} 
                    value={slot.startTime}
                    onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                  />
                  <span>-</span>
                  <input 
                    type="time" 
                    className="form-input" 
                    style={{ width: '130px', padding: '0.5rem' }} 
                    value={slot.endTime}
                    onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                  />
                </div>
              ) : (
                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Unavailable</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Availability;
