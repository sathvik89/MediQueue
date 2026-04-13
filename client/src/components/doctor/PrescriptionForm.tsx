import React, { useState } from 'react';
import type { PatientConsultation } from '../../types';
import { Button } from '../Button';
import './PrescriptionForm.css';

interface PrescriptionFormProps {
  patient: PatientConsultation | null;
  onComplete: (notes: string) => Promise<void>;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ patient, onComplete }) => {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!patient) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onComplete(notes);
      setNotes('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prescription-form-card">
      <h3>Prescription & Notes</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="textarea-field"
          placeholder="Enter diagnosis, medications, and advice here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          required
        ></textarea>
        <div className="form-actions">
          <Button type="submit" isLoading={isLoading}>
            Mark Consultation Complete
          </Button>
        </div>
      </form>
    </div>
  );
};
