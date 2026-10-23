import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, CheckCircle } from 'lucide-react';
import { prescriptionAPI } from '../../services/api';

export default function AddPrescriptionModal({ appointment, isOpen, onClose, onPrescriptionAdded }) {
  if (!isOpen || !appointment) return null;

  const [diagnosis, setDiagnosis] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [dietaryAdvice, setDietaryAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '1-0-1 (After food)', duration: '5 Days', instructions: 'Take with warm water' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '', frequency: '1-0-1 (After food)', duration: '5 Days', instructions: '' },
    ]);
  };

  const handleRemoveMedicineRow = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      setError('Please provide a clinical diagnosis.');
      return;
    }

    // Filter valid medicines
    const validMeds = medicines.filter((m) => m.name.trim() !== '');
    if (validMeds.length === 0) {
      setError('Please specify at least one medicine name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await prescriptionAPI.createPrescription({
        appointmentId: appointment._id,
        diagnosis,
        symptoms: appointment.symptoms,
        doctorNotes,
        dietaryAdvice,
        followUpDate,
        medicines: validMeds,
      });

      if (res.success) {
        if (onPrescriptionAdded) onPrescriptionAdded(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const patient = appointment.patientId || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div
          style={{
            padding: '16px 22px',
            background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.15rem' }}>
              Consultation & Digital Prescription
            </h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary-200)', marginTop: '2px' }}>
              Patient: <strong>{patient.name}</strong> • Apt #{appointment.appointmentNumber}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '22px' }}>
          {error && (
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--danger-bg)',
                color: '#b91c1c',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '16px',
              }}
            >
              {error}
            </div>
          )}

          {/* Patient Symptoms */}
          <div style={{ marginBottom: '14px', background: 'var(--slate-50)', padding: '10px 14px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 600, textTransform: 'uppercase' }}>
              Patient Reported Symptoms:
            </span>
            <div style={{ fontSize: '0.88rem', color: 'var(--slate-800)', marginTop: '2px' }}>
              {appointment.symptoms || 'No specific symptoms entered by patient.'}
            </div>
          </div>

          {/* Clinical Diagnosis */}
          <div className="form-group">
            <label className="form-label">Clinical Diagnosis *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Acute Bronchitis / Type 2 Diabetes Mellitus"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
          </div>

          {/* Dynamic Medicines Table */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Prescription Medicines
              </label>
              <button
                type="button"
                onClick={handleAddMedicineRow}
                className="btn btn-outline btn-sm"
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                <Plus size={14} />
                <span>Add Medicine</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {medicines.map((med, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.4fr 1fr 1fr 1fr 34px',
                    gap: '6px',
                    alignItems: 'center',
                    background: 'var(--slate-50)',
                    padding: '8px',
                    borderRadius: '8px',
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Medicine Name (e.g. Paracetamol)"
                    value={med.name}
                    onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                    style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Dosage (500mg)"
                    value={med.dosage}
                    onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                    style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Freq (1-0-1)"
                    value={med.frequency}
                    onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                    style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Duration (5 Days)"
                    value={med.duration}
                    onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                    style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicineRow(idx)}
                    disabled={medicines.length === 1}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: medicines.length === 1 ? 'var(--slate-300)' : '#ef4444',
                      cursor: medicines.length === 1 ? 'not-allowed' : 'pointer',
                      padding: '4px',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Notes & Dietary Advice */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Doctor's Clinical Notes</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Advice, precautions, lifestyle changes..."
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Dietary Instructions</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Low sodium, drink warm fluids..."
                value={dietaryAdvice}
                onChange={(e) => setDietaryAdvice(e.target.value)}
              />
            </div>
          </div>

          {/* Follow-up Date */}
          <div className="form-group">
            <label className="form-label">Follow-up Date (Optional)</label>
            <input
              type="date"
              className="form-control"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <CheckCircle size={16} />
              <span>{loading ? 'Issuing Rx...' : 'Complete & Issue Prescription'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
