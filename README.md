# 🏥 CARE CONNECT - Hospital Doctor Appointment Management System
### **Enterprise MERN Stack Platform with Pincode Proximity Search, JWT RBAC Security & Email OTP Recovery**
**📞 24/7 Connect Helpline: +91 98765 43210 | ✉️ Email: connect@careconnect.in**

---

## 📖 Overview

**CARE CONNECT** is an enterprise-grade **Hospital Doctor Appointment Management System** built with the **MERN Stack** (MongoDB, Express.js, React 18, Node.js). Designed for the Delhi-NCR and Western Uttar Pradesh medical corridor (**Delhi, Modinagar, Ghaziabad, Meerut**), it delivers an end-to-end digital healthcare experience:

- **Pincode-Driven Proximity Search**: Instant doctor and hospital discovery by exact 6-digit postal code with Haversine distance calculations.
- **Dynamic OPD Slot Management**: Multi-shift scheduling (Morning/Evening), break configurations, slot duration tuning, instant bookings, and automated cancellation/rescheduling recycling.
- **Consultation & Digital Rx**: Symptom tracking, clinical diagnosis, interactive medicine schedules, and print-ready digital prescriptions.
- **Enterprise JWT Security & RBAC**: Strict Bearer token authorization, role-based access control (Patient, Doctor, Admin), and anti-IDOR protections.
- **Real Email OTP Password Recovery**: Automated 6-digit verification codes sent directly to user email addresses via Nodemailer (Gmail / SMTP / Resend).
- **Paytm UPI QR Code Payment**: Integrated authentic UPI QR payment (Care Connect Hospital Reception) with countdown timer, UTR reconciliation, and print-ready receipts.
- **Breach-Resistant Password Security**: Client and server-side breach detection against known leaked passwords, preventing browser security pop-ups.
- **Modular Responsive Architecture**: Seamless experience across **Mobile**, **Tablet**, and **Desktop** screens with a modern glassmorphic medical UI design.

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| 💳 **UPI QR Code Payment** | Authentic Paytm UPI QR code payment flow (Care Connect Hospital Reception) for consultation fees with optional 12-digit UTR input, real-time slot reservation, and printable booking receipts. |
| 📍 **Pincode Proximity Engine** | Search by 6-digit Indian postal code (e.g. `110001`, `201204`, `201001`, `250001`) with configurable radius (Exact, 10km, 30km, 50km) and distance badges (e.g. `📍 1.2 km away`). |
| 📅 **Dynamic Slot Engine** | Shifts (Morning/Evening), break periods, custom durations (15m, 30m, 45m, 60m), real-time booking locks, and slot recycling upon cancellation. |
| 💊 **Digital Prescription Builder** | Clinicians create structured prescriptions: medicine name, dosage, frequency (`1-0-1 After food`), duration, instructions, and printable Rx sheets. |
| 🔐 **Enterprise JWT & RBAC** | Strict JWT authentication headers, role-based route guards, and IDOR mitigation preventing horizontal privilege escalation on appointment records. |
| 📧 **Real Email OTP Reset** | Automated 6-digit verification code delivered directly to the user's email address for secure, verified password resets. |
| 🛡️ **Breach-Resistant Credentials** | Real-time breach detection against common passwords (e.g. `admin123`) to prevent Google Chrome breach warnings, paired with a 1-click secure password generator. |
| 📱 **Fully Responsive Layout** | Clean modular CSS and flexible grid layouts tailored for mobile devices, tablets, and high-resolution desktop monitors. |
| ⭐ **Verified Patient Reviews** | 1–5 star ratings and reviews restricted strictly to verified, completed appointments to preserve review authenticity. |
| 📊 **Admin Telemetry & Analytics** | Executive dashboard displaying revenue metrics, consultation volumes, doctor verification switches, and user account block/unblock controls. |
| 🚀 **Dual-Mode MongoDB Engine** | Auto-connects to local MongoDB (`mongodb://127.0.0.1:27017/hospital_management`) or seamlessly starts an embedded in-process database (`mongodb-memory-server`) with auto-seeding. |

---

## 🔑 Demo Login Accounts

Pre-configured accounts ready for testing across all three system roles:

| Role | Email Address | Password | Description / Notes |
|---|---|---|---|
| **System Admin** | `admin@hospital.com` | `Anupam@9642` | Executive Management Console (High-entropy secure password) |
| **Doctor** | `doctor@hospital.com` | `Doctor#MedPortal2026!` *(or `doctor123`)* | Dr. Rajesh Sharma (Cardiologist, New Delhi) |
| **Patient** | `patient@hospital.com` | `Patient#CareConnect2026!` *(or `patient123`)* | Rahul Sharma (Patient, Pincode 110001) |

> 💡 **Quick Demo Access**: Instant 1-click sign-in buttons for Patient, Doctor, and Admin are available directly in the top navigation bar during development.

---

## 🏗️ System Architecture & Modular Structure

```
                                  +-----------------------+
                                  |     Users & Devices   |
                                  |  (Mobile, Tablet, PC) |
                                  +-----------+-----------+
                                              |
                                     HTTPS / REST API
                                              |
                                              v
                      +-----------------------------------------------+
                      |           BACKEND (Node.js + Express)         |
                      |                                               |
                      |  [Auth & JWT]        [Doctor & Hospital]     |
                      |  [Pincode Search]    [Availability & Slots]  |
                      |  [Appointments]      [Digital Prescription]  |
                      |  [Reviews & Alerts]  [Admin Telemetry]       |
                      |  [Email OTP Service] [Password Security]     |
                      +-----------------------+-----------------------+
                                              |
                                       Mongoose ODM
                                              |
                                              v
                      +-----------------------------------------------+
                      |              DATABASE (MongoDB)               |
                      |                                               |
                      |  users       doctors        hospitals         |
                      |  specializations  availabilities  appointments|
                      |  prescriptions    reviews         notifications|
                      +-----------------------------------------------+
```

### **Repository File Organization**

```
Hospital Doctor Appointment mangement System/
├── package.json                    # Workspace root scripts (dev, seed, install:all)
├── README.md                       # Comprehensive documentation
├── client/                         # Frontend Application (React 18 + Vite)
│   ├── index.html                  # HTML5 entry with responsive viewport tags
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite bundler configuration
│   └── src/
│       ├── main.jsx                # Application bootstrap
│       ├── App.jsx                 # Central router with role-based protected routes
│       ├── index.css               # Global responsive design system & CSS variables
│       ├── components/             # Reusable UI components
│       │   ├── common/             # Navbar, Footer, LoadingSpinners, NotificationBell
│       │   ├── doctor/             # DoctorCard, FilterBar, SlotPicker
│       │   ├── appointment/        # BookingModal, StatusBadge, RescheduleModal
│       │   └── prescription/       # PrescriptionSheet, MedicineRow
│       ├── context/                # React Context providers (AuthContext)
│       ├── pages/                  # Page views grouped by domain
│       │   ├── public/             # HomePage, DoctorSearchPage, HospitalListPage
│       │   ├── auth/               # LoginPage, RegisterPage, AdminLoginPage
│       │   ├── patient/            # PatientDashboard, MyAppointments, MyPrescriptions
│       │   ├── doctor/             # DoctorDashboard, ManageAvailability, PatientConsultation
│       │   └── admin/              # AdminDashboard, ManageDoctors, ManageHospitals
│       ├── services/               # Axios API client modules
│       └── utils/                  # Helper utilities (passwordSecurity, dateUtils)
└── server/                         # Backend Application (Node.js + Express)
    ├── server.js                   # Express application entry & database bootstrap
    ├── package.json                # Backend dependencies
    ├── .env                        # Environment configuration
    ├── .env.example                # Template environment variables
    ├── config/                     # Database connection & memory-server manager
    ├── controllers/                # Business logic handlers
    │   ├── authController.js       # Register, login, email OTP forgot/reset password
    │   ├── searchController.js     # Pincode search & geolocation calculations
    │   ├── doctorController.js     # Doctor profiles & verification
    │   ├── hospitalController.js   # Hospital registry
    │   ├── appointmentController.js# Slot locking, booking, reschedule, cancel
    │   ├── prescriptionController.js# Issue & read prescriptions (IDOR-protected)
    │   ├── reviewController.js     # Verified reviews & rating recalculation
    │   └── adminController.js      # Executive telemetry & user management
    ├── middleware/                 # Express middleware
    │   └── auth.js                 # JWT verification, RBAC guard & token validation
    ├── models/                     # Mongoose schemas & data validation
    │   ├── User.js                 # User credentials, roles, reset tokens
    │   ├── Doctor.js               # Specialization, qualifications, fees, rating
    │   ├── Hospital.js             # Facilities, GeoJSON location, departments
    │   ├── Specialization.js       # Medical categories
    │   ├── Availability.js         # Daily slots and booking status
    │   ├── Appointment.js          # Appointment details, status, timestamps
    │   ├── Prescription.js         # Clinical diagnosis & medicine regimens
    │   ├── Review.js               # Star ratings & comments
    │   └── Notification.js         # Real-time user alert records
    ├── routes/                     # REST API route declarations
    ├── seeder/                     # Database seed scripts
    │   ├── seedDelhiNCR.js         # Master Delhi-NCR medical corridor seeder
    │   └── seedData.js             # Extended sample dataset
    └── utils/                      # Server utilities
        ├── emailService.js         # Nodemailer OTP email transporter
        └── passwordSecurity.js     # Breach-checking & password entropy tools
```

---

## 🚀 Quick Start Guide

### **Prerequisites**
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB service running on `mongodb://127.0.0.1:27017` *(optional; embedded MongoDB automatically starts if local instance is not detected)*

---

### **1. Install Dependencies**

Install all dependencies for root, backend, and frontend with a single command:

```bash
npm run install:all
```

---

### **2. Environment Configuration**

Configure the server environment variables in `server/.env` (or copy from `server/.env.example`):

```ini
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/hospital_management
JWT_SECRET=hospital_appointment_secret_jwt_key_2026_super_secure
JWT_EXPIRE=7d

# -------------------------------------------------------------
# REAL EMAIL DELIVERY CONFIGURATION (FOR FORGOT PASSWORD OTP)
# -------------------------------------------------------------
# Option A: Gmail App Password
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password

# Option B: Resend API (HTTPS port 443)
# RESEND_API_KEY=re_xxxxxxxxxxxx

# Option C: Custom SMTP
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password
# EMAIL_FROM="Care Connect <no-reply@careconnect.in>"
```

---

### **3. Seed the Database**

Populate hospitals across Delhi, Modinagar, Ghaziabad, and Meerut with doctors, schedules, sample appointments, and prescriptions:

```bash
npm run seed
```

---

### **4. Start the Application**

Launch both the backend API and the frontend application concurrently:

```bash
npm run dev
```

- **Frontend Web Application**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:5001](http://localhost:5001)
- **API Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 📡 REST API Reference

### **Authentication & Password Recovery**
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new patient account | No |
| `POST` | `/api/auth/login` | Sign in (Patient, Doctor, Admin) and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer) |
| `POST` | `/api/auth/forgot-password` | Generate & email 6-digit verification code | No |
| `POST` | `/api/auth/reset-password` | Verify OTP and set new secure password | No |
| `POST` | `/api/auth/check-breach` | Real-time check if password is in breach list | No |

### **Search & Location Discovery**
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/search/doctors?pincode=110001&radius=30` | Pincode-based proximity doctor search | No |
| `GET` | `/api/search/pincodes?query=1100` | Autocomplete postal pincodes and cities | No |
| `GET` | `/api/search/hospitals` | Search partner hospitals by location & facility | No |

### **Doctor & Hospital Management**
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/doctors` | List verified doctors with filters | No |
| `GET` | `/api/doctors/:id` | Get complete doctor profile, OPD hours, and reviews | No |
| `PUT` | `/api/doctors/:id/verify` | Admin toggles doctor verification status | Admin |
| `GET` | `/api/hospitals` | List all hospitals | No |
| `POST` | `/api/hospitals` | Register a new hospital | Admin |

### **Availability & Appointments**
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/availability/doctor/:doctorId?date=YYYY-MM-DD` | Get available time slots for a doctor | No |
| `POST` | `/api/appointments` | Book a specific time slot | Patient |
| `GET` | `/api/appointments` | Fetch appointments (Role-scoped) | Yes |
| `PUT` | `/api/appointments/:id/confirm` | Doctor confirms appointment | Doctor |
| `PUT` | `/api/appointments/:id/cancel` | Cancel appointment and free time slot | Yes |
| `PUT` | `/api/appointments/:id/reschedule` | Reschedule appointment date and time slot | Yes |

### **Prescriptions & Reviews**
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/prescriptions` | Doctor creates digital consultation & prescription | Doctor |
| `GET` | `/api/prescriptions/appointment/:appointmentId` | Fetch prescription details (IDOR-protected) | Yes |
| `POST` | `/api/reviews` | Submit verified patient review (Completed visits) | Patient |

### **Admin Console**
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Executive telemetry (users, revenue, trends) | Admin |
| `PUT` | `/api/admin/users/:id/block` | Toggle user block/suspend status | Admin |

---

## 🔒 Security & Data Protection Standards

1. **Enterprise JWT Authentication**:
   - Every protected route enforces `Authorization: Bearer <token>`.
   - Tampered tokens, expired tokens, or missing tokens receive immediate `401 Unauthorized` responses with standardized error codes (`TOKEN_EXPIRED`, `TOKEN_INVALID`, `AUTH_TOKEN_REQUIRED`).

2. **Role-Based Access Control (RBAC)**:
   - Specific routes require strict role verification (`patient`, `doctor`, `admin`).
   - Unauthorized role attempts are rejected with `403 Forbidden` (`FORBIDDEN_ROLE`).

3. **Insecure Direct Object Reference (IDOR) Protection**:
   - Appointment and prescription endpoints verify that the requesting user is either the assigned patient, the attending doctor, or a system administrator.
   - Patients cannot inspect or manipulate other patients' records by guessing appointment IDs.

4. **Breach-Resistant Password Security**:
   - Passwords are validated both client-side and server-side to prevent the use of common breached passwords (e.g. `admin123`, `patient123`).
   - High-entropy admin credentials (`Anupam@9642`) prevent browser password manager breach alerts.
   - 1-click secure password generation assists users in creating resilient passwords during registration and reset flows.

5. **Direct Email OTP Verification**:
   - Password reset verification codes (6 digits) are generated securely and sent to the user's registered email with strict expiration timers (15 minutes).

---

## 📱 Responsive Design Standards

The frontend has been built from the ground up to support all screen form factors:

- **Mobile (< 768px)**: Compact header with slide-out drawer navigation, touch-friendly buttons (min 44px), single-column stacked cards, and scrollable slot selectors.
- **Tablet (768px – 1024px)**: 2-column adaptive grids, responsive filter toolbars, and streamlined table displays.
- **Desktop (> 1024px)**: Full multi-column dashboard layouts, sticky sidebar navigation, detailed telemetry charts, and expanded modal views.

---

## 🛠️ Tech Stack Details

- **Frontend**: React 18, React Router v6, Lucide React Icons, Canvas Confetti, Axios, Vite.
- **Backend**: Node.js, Express.js, Mongoose 8, JSON Web Tokens (jsonwebtoken), bcryptjs, Nodemailer, Morgan.
- **Database**: MongoDB (Local standalone service or Embedded In-Memory Runner).
- **Styling**: Modern Vanilla CSS Design System with CSS variables, Glassmorphism, and responsive media queries.

---

## 📄 License & Attribution

Developed for **CARE CONNECT Healthcare Platform**. Distributed under the **ISC License**.
For support or inquiries: **+91 98765 43210** | **connect@careconnect.in**
