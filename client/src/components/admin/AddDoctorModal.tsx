import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '../Input';
import { Button } from '../Button';
import { MEDICAL_SPECIALTIES } from '../../constants/specialties';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, specialty: string) => Promise<void>;
}

export const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialty) return;
    
    setIsLoading(true);
    try {
      await onAdd(name, specialty);
      setName('');
      setSpecialty('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Doctor</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <Input 
              label="Doctor Name" 
              placeholder="e.g., Jane Austen" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dark)' }}>Specialty</label>
              <select
                value={specialty}
                onChange={e => setSpecialty(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.625rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-color)',
                  color: 'var(--text-dark)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select specialty</option>
                {MEDICAL_SPECIALTIES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={!name || !specialty}>
              Add Doctor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
