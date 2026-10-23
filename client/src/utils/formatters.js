/**
 * CARE CONNECT - Frontend Shared Utility Functions
 * Centralized formatting and styling helpers for dates, currency, and UI badges.
 */

/**
 * Format numerical amount to Indian Rupee (INR) currency representation
 * @param {number|string} amount
 * @returns {string} e.g. "₹1,200"
 */
export function formatCurrency(amount) {
  const numeric = Number(amount) || 0;
  return `₹${numeric.toLocaleString('en-IN')}`;
}

/**
 * Format date string (YYYY-MM-DD or ISO) into readable presentation
 * @param {string} dateString
 * @param {Intl.DateTimeFormatOptions} options
 * @returns {string} e.g. "Monday, 24 Oct 2026"
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return 'N/A';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (year && month && day) {
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-IN', {
        weekday: options.weekday || 'short',
        day: options.day || 'numeric',
        month: options.month || 'short',
        year: options.year || 'numeric',
        ...options,
      });
    }
    return new Date(dateString).toLocaleDateString('en-IN', options);
  } catch (e) {
    return dateString;
  }
}

/**
 * Returns color-coded badge styling for appointment statuses
 * @param {string} status
 * @returns {{ label: string, bg: string, color: string, border: string }}
 */
export function getStatusBadge(status) {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'confirmed':
      return {
        label: 'Confirmed',
        bg: '#ecfdf5',
        color: '#059669',
        border: '#a7f3d0',
      };
    case 'completed':
      return {
        label: 'Completed',
        bg: '#eff6ff',
        color: '#2563eb',
        border: '#bfdbfe',
      };
    case 'pending':
      return {
        label: 'Pending Approval',
        bg: '#fffbeb',
        color: '#d97706',
        border: '#fde68a',
      };
    case 'rescheduled':
      return {
        label: 'Rescheduled',
        bg: '#f5f3ff',
        color: '#7c3aed',
        border: '#ddd6fe',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        bg: '#fef2f2',
        color: '#dc2626',
        border: '#fecaca',
      };
    default:
      return {
        label: status || 'Unknown',
        bg: '#f1f5f9',
        color: '#64748b',
        border: '#cbd5e1',
      };
  }
}

/**
 * Returns color-coded badge styling for doctor shifts
 * @param {string} shift
 * @returns {{ label: string, bg: string, color: string }}
 */
export function getShiftBadge(shift) {
  const s = (shift || 'Both').toLowerCase();
  if (s === 'morning') {
    return {
      label: 'Morning Shift (09:00 AM - 01:00 PM)',
      bg: '#fef3c7',
      color: '#b45309',
    };
  }
  if (s === 'evening') {
    return {
      label: 'Evening Shift (02:00 PM - 08:00 PM)',
      bg: '#ede9fe',
      color: '#6d28d9',
    };
  }
  return {
    label: 'All Shifts (09:00 AM - 08:00 PM)',
    bg: '#ecfdf5',
    color: '#047857',
  };
}

/**
 * Calculate age from date of birth string
 * @param {string} dobString YYYY-MM-DD
 * @returns {number|string}
 */
export function calculateAge(dobString) {
  if (!dobString) return '';
  const dob = new Date(dobString);
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
