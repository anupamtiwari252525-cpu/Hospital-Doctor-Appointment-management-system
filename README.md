# 🏥 CARE CONNECT - Hospital Doctor Appointment Management System
### **Full MERN Stack Project for Delhi, Modinagar, Ghaziabad, & Meerut with Pincode-Based Proximity Search**
**📞 24/7 Connect Helpline: +91 98765 43210 | ✉️ Email: connect@careconnect.in**

A state-of-the-art, enterprise-grade **Hospital Doctor Appointment Management System** titled **CARE CONNECT**, built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Engineered specifically for the Delhi-NCR and Western Uttar Pradesh medical corridor (**Delhi, Modinagar, Ghaziabad, Meerut**), featuring **Pincode-based Doctor Searching**, verified Indian medical specialists, automated time slot generation, digital consultation & prescription issuance, and administrative telemetry.

---

## 🌟 Key System Highlights

- 📍 **Pincode-Based Doctor Discovery**: Search doctors and hospitals by exact 6-digit postal pincode or custom geographic radius (Exact, 10 km, 30 km, 50 km).
- 📅 **Dynamic Slot Booking Engine**: Auto slot generation based on doctor shift timings (Morning/Evening), break hours, and slot durations.
- 💊 **Consultation & Digital Prescription**: Doctors record clinical symptoms, diagnosis, medicine schedules (dosage, frequency, duration), and generate print-ready Rx sheets.
- ⭐ **Strictly Verified Patient Reviews**: Only patients who have completed appointments can submit 1–5 star reviews, automatically recalibrating doctor rating averages.
- 🔔 **Real-Time In-App Notifications**: Instant alerts for appointment bookings, confirmations, cancellations, rescheduling, and prescription arrivals.
- 📊 **Executive Admin Dashboard**: Comprehensive statistics (total revenue, patients, doctors, hospitals, appointment trends, and user block/unblock control).
- 🚀 **Zero-Config MongoDB Server**: Auto-detects local MongoDB (`mongodb://127.0.0.1:27017/hospital_management`) or transparently launches an automated embedded MongoDB engine (`mongodb-memory-server`) with auto-seeding.

---

## 📐 7 Core Modules Architecture

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

### **1. Authentication & User Management**
- Role-based authorization for **Patient**, **Doctor**, and **Admin**.
- JWT tokens with bcrypt password hashing.
- Profile management with phone, address, and city/pincode mapping.
- 1-Click quick demo authentication in top navigation bar for instant testing.

### **2. Hospital & Doctor Management**
- **Hospital Registry**: Add/edit/deactivate hospitals, departments, facilities (ICU, Cath Lab, 24/7 Trauma), and postal pincodes.
- **Doctor Registry**: Qualifications (MBBS, MD, DM), medical registration, specialization, consultation fees, and hospital assignments.
- Admin verification and activation toggles.

### **3. Doctor Search & Discovery (Pincode-Based)**
- Search by **Doctor Name**, **Specialization**, **Hospital**, and **Pincode**.
- Haversine distance proximity calculation against target pincode coordinates.
- Visual badges for **"Direct Pincode Match"** and exact distance in kilometers (e.g. `📍 1.2 km away`).
- Multi-dimensional sorting: Nearest Pincode, Lowest Fee, Highest Rating, Most Experience.

### **4. Availability & Appointment Management**
- Working days, shift selection (Morning / Evening / Both), OPD hours, break periods, and custom slot durations (15m, 30m, 45m, 60m).
- 4-step booking flow: Select Doctor ➔ Pick Date ➔ Select Available Slot ➔ Confirm.
- Appointment statuses: `pending`, `confirmed`, `rescheduled`, `completed`, `cancelled`.
- Slot release upon cancellation and reschedule history tracking.

### **5. Consultation & Digital Prescription**
- Clinicians enter symptoms, clinical diagnosis, and dietary instructions.
- Dynamic medicine builder: Name, Dosage, Frequency (e.g., `1-0-1 After food`), Duration, and Notes.
- Printable standard Rx sheet with hospital header, doctor details, and follow-up dates.

### **6. Review & Notification**
- 1–5 Star ratings with clinical commentary.
- Enforced constraint: Only completed appointments can be reviewed.
- Unread notification bell with badge counters for booking status updates.

### **7. Admin Management**
- Aggregate telemetry: Total Users, Total Doctors, Total Hospitals, Total Appointments, Total Revenue.
- Month-on-month consultation volume growth charts.
- User management table with instant Block/Unblock security controls.

---

## 🗄️ Database Collections Structure (MongoDB)

| Collection | Schema Highlights |
|---|---|
| `users` | `_id`, `name`, `email`, `password`, `phone`, `role` (patient/doctor/admin), `avatar`, `pincode`, `city`, `isBlocked` |
| `hospitals` | `_id`, `name`, `address`, `city`, `pincode`, `location` (GeoJSON Point), `departments`, `facilities`, `rating` |
| `doctors` | `_id`, `userId` (ref User), `hospitalId` (ref Hospital), `qualification`, `specialization`, `experience`, `consultationFee`, `rating` |
| `specializations`| `_id`, `name`, `description`, `icon`, `popularTreatments`, `isActive` |
| `availabilities` | `_id`, `doctorId`, `date`, `dayOfWeek`, `shift`, `slots: [{ time, isBooked, appointmentId }]` |
| `appointments` | `_id`, `appointmentNumber`, `patientId`, `doctorId`, `hospitalId`, `date`, `timeSlot`, `fee`, `status`, `paymentStatus` |
| `prescriptions` | `_id`, `appointmentId`, `patientId`, `doctorId`, `diagnosis`, `medicines: [{ name, dosage, frequency, duration }]` |
| `reviews` | `_id`, `appointmentId`, `patientId`, `doctorId`, `rating` (1–5), `comment` |
| `notifications` | `_id`, `userId`, `type`, `title`, `message`, `link`, `isRead` |

---

## 🔑 Demo Login Accounts

Pre-populated accounts ready for instant 1-click testing or manual login:

| Role | Email | Password | Details |
|---|---|---|---|
| **Admin** | `admin@hospital.com` | `admin123` | System Administrator Console |
| **Doctor** | `doctor@hospital.com` | `doctor123` | Dr. Rajesh Sharma (Cardiologist, New Delhi) |
| **Patient** | `patient@hospital.com` | `patient123` | Rahul Sharma (Patient, Pincode 110001) |

*(You can also use the **Demo: Patient / Doctor / Admin** buttons in the navigation bar for instant 1-click sign in!)*

---

## 🚀 Quick Start Guide

### **Prerequisites**
- Node.js (v18 or higher)
- npm (v9 or higher)

### **1. Clone & Install Dependencies**
```bash
# In the project root directory
npm run install:all
```

### **2. Seed the Database**
Populate hospitals across multiple Indian pincodes, doctors, schedules, sample appointments, and prescriptions:
```bash
npm run seed
```

### **3. Start Both Backend & Frontend Concurrently**
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5001`
- **API Health Check**: `http://localhost:5001/api/health`

---

## 📡 REST API Reference Summary

### **Authentication**
- `POST /api/auth/register` — Register patient account
- `POST /api/auth/login` — Login user (Patient/Doctor/Admin)
- `GET  /api/auth/me` — Get authenticated user profile

### **Pincode Search & Discovery**
- `GET  /api/search/doctors?pincode=110001&radius=30` — Proximity doctor search with pincode distance
- `GET  /api/search/pincodes` — Autocomplete suggested postal codes and locations
- `GET  /api/search/hospitals` — Search hospitals by pincode, city, or facilities

### **Doctor & Hospital Management**
- `GET  /api/doctors` — List all active doctors
- `GET  /api/doctors/:id` — Get doctor profile with reviews
- `PUT  /api/doctors/:id/verify` — Toggle doctor verification (Admin)
- `GET  /api/hospitals` — List all partner hospitals
- `POST /api/hospitals` — Add new hospital (Admin)

### **Appointments & Availability**
- `GET  /api/availability/doctor/:doctorId?date=YYYY-MM-DD` — Doctor slots for specific date
- `POST /api/appointments` — Book new appointment slot
- `GET  /api/appointments` — List appointments (Role-filtered)
- `PUT  /api/appointments/:id/confirm` — Doctor confirms appointment
- `PUT  /api/appointments/:id/cancel` — Cancel appointment with reason
- `PUT  /api/appointments/:id/reschedule` — Reschedule date & slot

### **Prescriptions & Reviews**
- `POST /api/prescriptions` — Issue digital consultation & prescription
- `GET  /api/prescriptions/appointment/:appointmentId` — Fetch prescription
- `POST /api/reviews` — Submit verified patient review (Completed visits only)
- `GET  /api/admin/dashboard` — Executive telemetry analytics

---

## 💻 Tech Stack Overview

- **Frontend**: React 18, React Router v6, Lucide React Icons, Canvas Confetti, Custom Glassmorphic Medical CSS.
- **Backend**: Node.js, Express.js, Mongoose, JWT (JSON Web Tokens), bcryptjs, Morgan.
- **Database**: MongoDB (Local `mongod` or Embedded In-Process Runner with automatic seeding).
- **Tooling**: Vite Bundler.
