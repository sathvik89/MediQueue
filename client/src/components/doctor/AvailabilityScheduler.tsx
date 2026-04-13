import React, { useState, useEffect } from 'react';
import { getAvailability, updateAvailability } from '../../services/doctorService';
import { Button } from '../Button';
import './AvailabilityScheduler.css';

const ALL_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

export const AvailabilityScheduler: React.FC = () => {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const slots = await getAvailability();
        setSelectedSlots(slots);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlots();
  }, []);

  const toggleSlot = (slot: string) => {
    setSelectedSlots(prev => 
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAvailability(selectedSlots);
      alert("Availability saved successfully!");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="scheduler-container">Loading schedule...</div>;
  }

  return (
    <div className="scheduler-container">
      <div className="scheduler-header">
        <h3>Weekly Availability</h3>
        <p>Select the time slots you are available for consultations.</p>
      </div>

      <div className="time-grid">
        {ALL_SLOTS.map(slot => {
          const isActive = selectedSlots.includes(slot);
          return (
            <div 
              key={slot} 
              className={`time-toggle ${isActive ? 'active' : ''}`}
              onClick={() => toggleSlot(slot)}
            >
              <input 
                type="checkbox" 
                checked={isActive} 
                onChange={() => {}} // React controlled checked warning avoidance
                id={`slot-${slot}`}
              />
              <label htmlFor={`slot-${slot}`}>{slot}</label>
            </div>
          );
        })}
      </div>

      <div className="scheduler-actions">
        <Button onClick={handleSave} isLoading={isSaving}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};
