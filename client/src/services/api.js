import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong with the server';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const searchAPI = {
  // Pincode base doctor search
  searchDoctors: (params) => api.get('/search/doctors', { params }),
  getPincodes: (query) => api.get('/search/pincodes', { params: { query } }),
  searchHospitals: (params) => api.get('/search/hospitals', { params }),
};

export const doctorAPI = {
  getAllDoctors: (params) => api.get('/doctors', { params }),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  getMyProfile: () => api.get('/doctors/me/profile'),
  createDoctor: (data) => api.post('/doctors', data),
  updateDoctor: (id, data) => api.put(`/doctors/${id}`, data),
  toggleVerify: (id) => api.put(`/doctors/${id}/verify`),
  toggleStatus: (id) => api.put(`/doctors/${id}/status`),
};

export const hospitalAPI = {
  getAllHospitals: (params) => api.get('/hospitals', { params }),
  getHospitalById: (id) => api.get(`/hospitals/${id}`),
  createHospital: (data) => api.post('/hospitals', data),
  updateHospital: (id, data) => api.put(`/hospitals/${id}`, data),
  deleteHospital: (id) => api.delete(`/hospitals/${id}`),
};

export const availabilityAPI = {
  getDoctorAvailability: (doctorId, date) =>
    api.get(`/availability/doctor/${doctorId}`, { params: { date } }),
  getUpcomingDays: (doctorId) => api.get(`/availability/upcoming/${doctorId}`),
  setAvailability: (data) => api.post('/availability/set', data),
};

export const appointmentAPI = {
  bookAppointment: (data) => api.post('/appointments', data),
  getAppointments: (params) => api.get('/appointments', { params }),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  confirmAppointment: (id) => api.put(`/appointments/${id}/confirm`),
  cancelAppointment: (id, reason) => api.put(`/appointments/${id}/cancel`, { reason }),
  rescheduleAppointment: (id, data) => api.put(`/appointments/${id}/reschedule`, data),
  completeAppointment: (id) => api.put(`/appointments/${id}/complete`),
};

export const prescriptionAPI = {
  createPrescription: (data) => api.post('/prescriptions', data),
  getPrescriptionByAppointment: (appointmentId) =>
    api.get(`/prescriptions/appointment/${appointmentId}`),
  getPatientPrescriptions: (patientId) =>
    api.get(`/prescriptions/patient${patientId ? `/${patientId}` : ''}`),
};

export const reviewAPI = {
  createReview: (data) => api.post('/reviews', data),
  getDoctorReviews: (doctorId) => api.get(`/reviews/doctor/${doctorId}`),
};

export const notificationAPI = {
  getMyNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  toggleUserBlock: (id) => api.put(`/admin/users/${id}/status`),
  getSpecializations: () => api.get('/admin/specializations'),
  createSpecialization: (data) => api.post('/admin/specializations', data),
  deleteSpecialization: (id) => api.delete(`/admin/specializations/${id}`),
};

export default api;
