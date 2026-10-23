import React, { useState } from 'react';
import { Star, X, CheckCircle, AlertCircle } from 'lucide-react';
import { reviewAPI } from '../../services/api';

export default function ReviewModal({ appointment, isOpen, onClose, onReviewSubmitted }) {
  if (!isOpen || !appointment) return null;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const doctor = appointment.doctorId || {};
  const doctorUser = doctor.userId || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a few words about your consultation experience.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await reviewAPI.createReview({
        appointmentId: appointment._id,
        rating,
        comment,
      });

      if (res.success) {
        if (onReviewSubmitted) onReviewSubmitted(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--slate-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>Leave Doctor Review</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {error && (
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--danger-bg)',
                color: '#b91c1c',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '14px',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '18px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>How was your visit with</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '2px' }}>
              {doctorUser.name ? `Dr. ${doctorUser.name.replace(/^(dr\.?\s*)+/i, '')}` : 'Dr. Physician'}
            </div>

            {/* Interactive Star Rating */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  <Star
                    size={30}
                    fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                    color={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '6px', fontWeight: 600 }}>
              {rating === 5 ? 'Excellent Care' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : 'Could be Better'}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Feedback / Review Comments</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Share details about the doctor's diagnosis, punctuality, and staff attentiveness..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
              {loading ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
