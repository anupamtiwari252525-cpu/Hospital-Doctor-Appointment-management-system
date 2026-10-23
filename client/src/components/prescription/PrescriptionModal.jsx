import React from 'react';
import { X, Printer, Activity, Calendar, User, Building, Pill, FileText, CheckCircle2 } from 'lucide-react';

export default function PrescriptionModal({ prescription, isOpen, onClose }) {
  if (!isOpen || !prescription) return null;

  const doctor = prescription.doctorId || {};
  const doctorUser = doctor.userId || {};
  const hospital = prescription.hospitalId || {};
  const patient = prescription.patientId || {};
  const medicines = prescription.medicines || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content printable-prescription"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px', padding: 0 }}
      >
        {/* Modal Top Actions (Hidden on Print) */}
        <div
          className="no-print"
          style={{
            padding: '14px 20px',
            background: 'var(--slate-100)',
            borderBottom: '1px solid var(--slate-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--slate-800)' }}>
            <FileText size={18} style={{ color: 'var(--primary-600)' }} />
            <span>Digital Medical Prescription & Consultation Summary</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={handlePrint} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Printer size={15} />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--slate-400)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Prescription Paper Sheet */}
        <div style={{ padding: '32px 36px', background: '#ffffff', color: 'var(--slate-900)' }}>
          
          {/* Header: Hospital & Doctor details */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid var(--primary-600)',
              paddingBottom: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Activity size={24} style={{ color: 'var(--primary-600)' }} />
                <h2 style={{ fontSize: '1.35rem', color: 'var(--slate-900)', fontWeight: 800 }}>
                  {hospital.name || 'CARE CONNECT Healthcare Network'}
                </h2>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', lineHeight: 1.4 }}>
                {hospital.address || 'Regional Healthcare Complex'}, {hospital.city || 'Delhi NCR'}
                <br />
                Pincode: <strong>{hospital.pincode || '110001'}</strong> • Helpline: {hospital.contactNumber || '+91 98765 43210'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-800)', fontWeight: 700 }}>
                {doctorUser.name ? `Dr. ${doctorUser.name.replace(/^(dr\.?\s*)+/i, '')}` : 'Consulting Physician'}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', fontWeight: 600 }}>
                {doctor.qualification}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--primary-700)', fontWeight: 700 }}>
                Dept of {doctor.specialization}
              </div>
            </div>
          </div>

          {/* Patient Details Bar */}
          <div
            style={{
              background: 'var(--slate-50)',
              border: '1px solid var(--slate-200)',
              borderRadius: '8px',
              padding: '12px 18px',
              margin: '18px 0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              fontSize: '0.82rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--slate-500)' }}>Patient Name:</span>
              <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{patient.name}</div>
            </div>
            <div>
              <span style={{ color: 'var(--slate-500)' }}>Date:</span>
              <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                {new Date(prescription.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--slate-500)' }}>Pincode / City:</span>
              <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                {patient.pincode || 'N/A'}, {patient.city || ''}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--slate-500)' }}>Phone:</span>
              <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{patient.phone || 'N/A'}</div>
            </div>
          </div>

          {/* Clinical Findings & Diagnosis */}
          <div style={{ marginBottom: '20px' }}>
            {prescription.symptoms && (
              <div style={{ marginBottom: '10px', fontSize: '0.88rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--slate-700)' }}>Presented Symptoms: </span>
                <span style={{ color: 'var(--slate-800)' }}>{prescription.symptoms}</span>
              </div>
            )}

            <div
              style={{
                background: 'var(--primary-50)',
                border: '1px solid var(--primary-200)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.92rem',
              }}
            >
              <span style={{ fontWeight: 800, color: 'var(--primary-900)' }}>Diagnosis: </span>
              <span style={{ color: 'var(--primary-800)', fontWeight: 600 }}>{prescription.diagnosis}</span>
            </div>
          </div>

          {/* Rx Medicines Table */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                ℞
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                Prescribed Medications
              </span>
            </div>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.85rem',
                border: '1px solid var(--slate-200)',
              }}
            >
              <thead>
                <tr style={{ background: 'var(--slate-100)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 12px', border: '1px solid var(--slate-200)' }}>Medicine Name</th>
                  <th style={{ padding: '8px 12px', border: '1px solid var(--slate-200)' }}>Dosage</th>
                  <th style={{ padding: '8px 12px', border: '1px solid var(--slate-200)' }}>Frequency</th>
                  <th style={{ padding: '8px 12px', border: '1px solid var(--slate-200)' }}>Duration</th>
                  <th style={{ padding: '8px 12px', border: '1px solid var(--slate-200)' }}>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : 'var(--slate-50)' }}>
                    <td style={{ padding: '8px 12px', border: '1px solid var(--slate-200)', fontWeight: 600 }}>
                      {med.name}
                    </td>
                    <td style={{ padding: '8px 12px', border: '1px solid var(--slate-200)' }}>{med.dosage}</td>
                    <td style={{ padding: '8px 12px', border: '1px solid var(--slate-200)' }}>{med.frequency}</td>
                    <td style={{ padding: '8px 12px', border: '1px solid var(--slate-200)' }}>{med.duration}</td>
                    <td style={{ padding: '8px 12px', border: '1px solid var(--slate-200)', color: 'var(--slate-600)' }}>
                      {med.instructions || 'As advised'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Advice & Tests */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '0.84rem' }}>
            {prescription.doctorNotes && (
              <div style={{ background: 'var(--slate-50)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--slate-200)' }}>
                <span style={{ fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
                  Doctor's Notes & Advice:
                </span>
                <span style={{ color: 'var(--slate-600)' }}>{prescription.doctorNotes}</span>
              </div>
            )}

            {prescription.dietaryAdvice && (
              <div style={{ background: 'var(--slate-50)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--slate-200)' }}>
                <span style={{ fontWeight: 700, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
                  Dietary & Lifestyle Advice:
                </span>
                <span style={{ color: 'var(--slate-600)' }}>{prescription.dietaryAdvice}</span>
              </div>
            )}
          </div>

          {/* Footer & Signature */}
          <div
            style={{
              marginTop: '40px',
              paddingTop: '20px',
              borderTop: '1px solid var(--slate-200)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {prescription.followUpDate && (
                <div style={{ fontSize: '0.84rem', color: 'var(--primary-800)', fontWeight: 700 }}>
                  📅 Follow-up Date: {prescription.followUpDate}
                </div>
              )}
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: '4px' }}>
                System-verified Electronic Prescription • Valid without physical signature
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid var(--slate-400)', width: '160px', marginBottom: '6px' }}></div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                {doctorUser.name ? `Dr. ${doctorUser.name.replace(/^(dr\.?\s*)+/i, '')}` : 'Doctor Signature'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Reg. No: MCI-74892</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
