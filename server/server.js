const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Base / Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Hospital Doctor Appointment Management System API',
    timestamp: new Date().toISOString(),
    features: [
      'Pincode based doctor search',
      'Doctor & Hospital Management',
      'Role-based JWT Authentication',
      'Slot booking & Real-time availability',
      'Consultation & Digital Prescription',
      'Patient Reviews & In-app Notifications',
      'Comprehensive Admin Analytics',
    ],
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/availability', require('./routes/availabilityRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Start server after connecting to MongoDB
let server;
connectDB()
  .then(async () => {
    // Check if database is empty; if so, populate demo seed data automatically
    const Hospital = require('./models/Hospital');
    const hospitalCount = await Hospital.countDocuments();
    if (hospitalCount === 0) {
      console.log('Database is empty. Automatically seeding demo data (hospitals, doctors, pincodes)...');
      try {
        const { seedData } = require('./seeder/seedData');
        await seedData(false);
        console.log('Initial database auto-seed completed successfully.');
      } catch (seedErr) {
        console.warn('Auto-seed warning:', seedErr.message);
      }
    }

    server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` Hospital Doctor Appointment Server Running on port ${PORT}`);
      console.log(` API Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database connection:', err);
    process.exit(1);
  });

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
