const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Specialization = require('../models/Specialization');
const Doctor = require('../models/Doctor');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const { generateTimeSlots } = require('../utils/slotGenerator');

dotenv.config();

const specializationsData = [
  {
    name: 'Cardiology',
    description: 'Heart and cardiovascular system care, ECG, bypass, and angioplasty management.',
    icon: 'HeartPulse',
    popularTreatments: ['ECG & Echo', 'Angiography', 'Heart Failure Management', 'Hypertension Control'],
  },
  {
    name: 'Neurology',
    description: 'Brain, spinal cord, and peripheral nervous system disorders and stroke recovery.',
    icon: 'Brain',
    popularTreatments: ['Migraine Management', 'Epilepsy Care', 'Stroke Rehabilitation', 'Neuropathy Treatment'],
  },
  {
    name: 'Orthopedics',
    description: 'Bones, joints, ligaments, tendons, and spine surgery and sports injuries.',
    icon: 'Bone',
    popularTreatments: ['Joint Replacement', 'Fracture Care', 'Spine Arthroscopy', 'Arthritis Therapy'],
  },
  {
    name: 'Pediatrics',
    description: 'Infant, child, and adolescent healthcare, vaccinations, and growth monitoring.',
    icon: 'Baby',
    popularTreatments: ['Immunization', 'Neonatal Care', 'Pediatric Asthma', 'Growth Assessment'],
  },
  {
    name: 'Dermatology',
    description: 'Skin, hair, nail health, cosmetic dermatology, and allergy diagnosis.',
    icon: 'Sparkles',
    popularTreatments: ['Acne Treatment', 'Laser Therapy', 'Psoriasis Care', 'Hair Loss Treatment'],
  },
  {
    name: 'Gynecology & Obstetrics',
    description: 'Women reproductive health, maternity care, and fertility treatment.',
    icon: 'Activity',
    popularTreatments: ['Prenatal Care', 'High-Risk Pregnancy', 'PCOS Management', 'Fertility Counseling'],
  },
  {
    name: 'General Medicine',
    description: 'Primary care, fever, viral infections, diabetes, and preventive checkups.',
    icon: 'Stethoscope',
    popularTreatments: ['Fever & Infection', 'Diabetes Management', 'Annual Health Check', 'Thyroid Disorder'],
  },
  {
    name: 'ENT (Otolaryngology)',
    description: 'Ear, nose, throat, sinus, and hearing loss medical and surgical treatments.',
    icon: 'Ear',
    popularTreatments: ['Sinus Surgery', 'Hearing Assessment', 'Tonsillectomy', 'Allergy Management'],
  },
  {
    name: 'Ophthalmology',
    description: 'Comprehensive eye care, cataract surgery, glaucoma, and vision correction.',
    icon: 'Eye',
    popularTreatments: ['Cataract Surgery', 'LASIK Consultation', 'Glaucoma Care', 'Diabetic Retinopathy'],
  },
];

// Hospitals specifically in Delhi, Modinagar, Ghaziabad, and Meerut
const hospitalsData = [
  // --- DELHI ---
  {
    name: 'AIIMS Apex Medical Research Institute',
    email: 'contact@aiims-careconnect.in',
    contactNumber: '+91 11 2658 8500',
    address: 'Sri Aurobindo Marg, Ansari Nagar East',
    area: 'Safdarjung Enclave / AIIMS Campus',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110029',
    location: { type: 'Point', coordinates: [77.2100, 28.5672] },
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'],
    facilities: ['Level 1 Trauma Centre', '24/7 Blood Bank', 'Organ Transplant', 'Free Medicine Counter'],
    openingHours: '24 Hours Emergency / OPD: 08:30 AM - 04:30 PM',
    rating: 4.9,
    totalReviews: 540,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Apollo Super Speciality Hospital',
    email: 'delhi@careconnect.in',
    contactNumber: '+91 11 2692 5858',
    address: 'Connaught Place Healthcare Hub, Barakhamba Road',
    area: 'Connaught Place / Central Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    location: { type: 'Point', coordinates: [77.2197, 28.6328] },
    departments: ['Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 'Gynecology & Obstetrics'],
    facilities: ['24/7 Emergency', 'Advanced Cath Lab', 'Robotic Surgery', 'MRI & CT Scanner'],
    openingHours: '24 Hours Emergency / OPD: 09:00 AM - 07:00 PM',
    rating: 4.8,
    totalReviews: 320,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Max Super Speciality Hospital Patparganj',
    email: 'patparganj@careconnect.in',
    contactNumber: '+91 11 4303 3333',
    address: '108 A, IP Extension, Patparganj',
    area: 'Laxmi Nagar / Patparganj Hub',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110092',
    location: { type: 'Point', coordinates: [77.2926, 28.6310] },
    departments: ['Orthopedics', 'Cardiology', 'General Medicine', 'Ophthalmology'],
    facilities: ['24/7 Emergency', 'Cardiac ICU', 'Pathology Lab', 'Physiotherapy Unit'],
    openingHours: '24 Hours Emergency / OPD: 08:30 AM - 08:00 PM',
    rating: 4.8,
    totalReviews: 290,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
  },

  // --- MODINAGAR ---
  {
    name: 'Modi Hospital & Research Centre',
    email: 'modihospital@careconnect.in',
    contactNumber: '+91 1232 242 555',
    address: 'Delhi-Meerut Road, Near Modi Mandir, Modinagar',
    area: 'Delhi-Meerut Road / Modinagar Central',
    city: 'Modinagar',
    state: 'Uttar Pradesh',
    pincode: '201204',
    location: { type: 'Point', coordinates: [77.5831, 28.8315] },
    departments: ['General Medicine', 'Orthopedics', 'Pediatrics', 'Gynecology & Obstetrics', 'ENT (Otolaryngology)'],
    facilities: ['24/7 Emergency Trauma Care', 'ICU & NICU', 'Digital X-Ray / Pathology', 'Ambulance Helpline'],
    openingHours: '24 Hours Emergency / OPD: 08:30 AM - 07:30 PM',
    rating: 4.7,
    totalReviews: 215,
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'SRM Global Multi-Speciality Hospital',
    email: 'srmhospital@careconnect.in',
    contactNumber: '+91 1232 234 300',
    address: 'Delhi-NCR Campus, Delhi-Meerut Road, Modinagar',
    area: 'SRM University & Highway Medical Zone',
    city: 'Modinagar',
    state: 'Uttar Pradesh',
    pincode: '201204',
    location: { type: 'Point', coordinates: [77.5910, 28.8390] },
    departments: ['Cardiology', 'Dermatology', 'General Medicine', 'Orthopedics'],
    facilities: ['Modern ICU', 'Modular OT', '24/7 Pharmacy', 'Radiology Suite'],
    openingHours: '24 Hours Emergency / OPD: 09:00 AM - 06:00 PM',
    rating: 4.8,
    totalReviews: 180,
    image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=600&q=80',
  },

  // --- GHAZIABAD ---
  {
    name: 'Yashoda Super Speciality Hospital',
    email: 'yashoda@careconnect.in',
    contactNumber: '+91 120 418 2000',
    address: 'Nehru Nagar, Near Navyug Market & Old Bus Stand, GT Road',
    area: 'Navyug Market / Old Bus Stand Zone',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: '201001',
    location: { type: 'Point', coordinates: [77.4538, 28.6692] },
    departments: ['Cardiology', 'Neurology', 'Gynecology & Obstetrics', 'Orthopedics', 'Pediatrics'],
    facilities: ['24/7 Advanced Emergency', 'Cardiac Cath Lab', 'Neuro ICU', 'Dialysis Centre', 'Blood Bank'],
    openingHours: '24 Hours Emergency / OPD: 08:00 AM - 08:00 PM',
    rating: 4.9,
    totalReviews: 460,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Max Super Speciality Hospital Vaishali',
    email: 'vaishali@careconnect.in',
    contactNumber: '+91 120 417 3000',
    address: 'W-3 Sector 1, Vaishali & Indirapuram Hub',
    area: 'Indirapuram / Vaishali Healthcare Zone',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: '201010',
    location: { type: 'Point', coordinates: [77.3714, 28.6415] },
    departments: ['Cardiology', 'Pediatrics', 'Neurology', 'Dermatology', 'General Medicine'],
    facilities: ['24/7 Critical Care', 'CyberKnife', 'Day Care Surgery', 'NICU / PICU', 'Executive Lounge'],
    openingHours: '24 Hours Emergency / OPD: 08:30 AM - 08:00 PM',
    rating: 4.9,
    totalReviews: 380,
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Manipal Multi-Speciality Hospital',
    email: 'manipal.gzb@careconnect.in',
    contactNumber: '+91 120 400 5555',
    address: 'NH-24 Bypass, Near Crossings Republik & Raj Nagar Extension',
    area: 'Raj Nagar / NH-24 Bypass Zone',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: '201002',
    location: { type: 'Point', coordinates: [77.4470, 28.6830] },
    departments: ['Orthopedics', 'General Medicine', 'ENT (Otolaryngology)', 'Ophthalmology'],
    facilities: ['24/7 Trauma Services', 'Cardiac OT', 'High-End Radiology', '24/7 Ambulance'],
    openingHours: '24 Hours Emergency / OPD: 09:00 AM - 07:00 PM',
    rating: 4.8,
    totalReviews: 240,
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=80',
  },

  // --- MEERUT ---
  {
    name: 'Anand Hospital & Cardiac Institute',
    email: 'anandhospital@careconnect.in',
    contactNumber: '+91 121 276 0000',
    address: 'A-1 Damodar Colony, Garh Road, Shastri Nagar',
    area: 'Garh Road / Shastri Nagar Medical Hub',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    pincode: '250004',
    location: { type: 'Point', coordinates: [77.7290, 28.9667] },
    departments: ['Cardiology', 'Orthopedics', 'Neurology', 'General Medicine', 'Pediatrics'],
    facilities: ['24/7 Cardiac Emergency', 'Advanced Cath Lab', 'Trauma Centre', 'MRI & CT Scanner', 'ICU'],
    openingHours: '24 Hours Emergency / OPD: 08:30 AM - 07:30 PM',
    rating: 4.9,
    totalReviews: 410,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Nutema Multi-Speciality Hospital',
    email: 'nutema@careconnect.in',
    contactNumber: '+91 121 260 4444',
    address: 'Near Central Market, Shastri Nagar',
    area: 'Shastri Nagar / Medical College Road',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    pincode: '250004',
    location: { type: 'Point', coordinates: [77.7250, 28.9640] },
    departments: ['Ophthalmology', 'ENT (Otolaryngology)', 'Dermatology', 'General Medicine'],
    facilities: ['LASIK Eye Suite', 'Micro-Ear Surgery OT', '24/7 Pharmacy', 'Emergency Casualty'],
    openingHours: '24 Hours Emergency / OPD: 09:00 AM - 08:00 PM',
    rating: 4.8,
    totalReviews: 195,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Subharti Multi-Speciality Hospital',
    email: 'subharti@careconnect.in',
    contactNumber: '+91 121 243 9043',
    address: 'Subhartipuram, Delhi-Haridwar Bypass, NH-58',
    area: 'Subhartipuram / NH-58 Medical Campus',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    pincode: '250005',
    location: { type: 'Point', coordinates: [77.6710, 29.0125] },
    departments: ['General Medicine', 'ENT (Otolaryngology)', 'Pediatrics', 'Orthopedics', 'Gynecology & Obstetrics'],
    facilities: ['1000+ Bed Teaching Hospital', 'Super Speciality ICU', '24/7 Trauma Unit', 'Subsidized Pharmacy'],
    openingHours: '24 Hours Emergency / OPD: 08:00 AM - 04:00 PM',
    rating: 4.7,
    totalReviews: 310,
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80',
  },
];

async function seedData(standalone = false) {
  console.log('--- Starting CARE CONNECT Database Seeder (Delhi, Modinagar, Ghaziabad, Meerut) ---');
  if (standalone) {
    await connectDB();
  }

  // Clear existing collections
  console.log('Clearing old collections...');
  await User.deleteMany();
  await Hospital.deleteMany();
  await Specialization.deleteMany();
  await Doctor.deleteMany();
  await Availability.deleteMany();
  await Appointment.deleteMany();
  await Prescription.deleteMany();
  await Review.deleteMany();
  await Notification.deleteMany();

  // 1. Create Specializations
  console.log('Inserting Specializations...');
  await Specialization.insertMany(specializationsData);

  // 2. Create Hospitals
  console.log('Inserting Hospitals in Delhi, Modinagar, Ghaziabad, Meerut...');
  const hospitals = await Hospital.insertMany(hospitalsData);
  const aiimsDelhi = hospitals[0];
  const apolloDelhi = hospitals[1];
  const maxPatparganj = hospitals[2];
  const modiHospital = hospitals[3];
  const srmHospital = hospitals[4];
  const yashodaGzb = hospitals[5];
  const maxVaishali = hospitals[6];
  const manipalGzb = hospitals[7];
  const anandMeerut = hospitals[8];
  const nutemaMeerut = hospitals[9];
  const subhartiMeerut = hospitals[10];

  // 3. Create Admin Account (CareConnect Admin)
  console.log('Creating Admin Account...');
  const adminUser = await User.create({
    name: 'Dr. Vipin Gupta (Admin)',
    email: 'admin@hospital.com',
    password: 'Anupam@9642',
    phone: '+91 98765 43210',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: '201001',
  });

  // 4. Create Demo Patients
  console.log('Creating Demo Patients...');
  const patient1 = await User.create({
    name: 'Rahul Sharma',
    email: 'patient@hospital.com',
    password: 'patient123',
    phone: '+91 98765 43210',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    address: 'Near KNMIET College, Delhi-Meerut Road',
    city: 'Modinagar',
    state: 'Uttar Pradesh',
    pincode: '201204',
  });

  const patient2 = await User.create({
    name: 'Pooja Verma',
    email: 'pooja.verma@careconnect.in',
    password: 'patient123',
    phone: '+91 98110 55443',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    address: 'Flat 302, Shipra Suncity, Indirapuram',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    pincode: '201010',
  });

  const patient3 = await User.create({
    name: 'Amitabh Saxena',
    email: 'amitabh.saxena@careconnect.in',
    password: 'patient123',
    phone: '+91 98370 12345',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    address: '14 Shastri Nagar, Garh Road',
    city: 'Meerut',
    state: 'Uttar Pradesh',
    pincode: '250004',
  });

  // 5. Create Indian Doctors (with authentic Indian Doctor profile portraits)
  console.log('Creating Indian Doctors in Delhi, Modinagar, Ghaziabad, Meerut...');
  const doctorsListConfig = [
    // 1. Delhi - Cardiologist
    {
      name: 'Dr. Rajesh Sharma',
      email: 'doctor@hospital.com',
      password: 'doctor123',
      phone: '+91 98111 22334',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80', // Indian Male Doctor with stethoscope
      pincode: '110029',
      city: 'New Delhi',
      hospital: aiimsDelhi,
      qualification: 'MBBS, MD (Internal Medicine), DM (Cardiology), FACC',
      specialization: 'Cardiology',
      experience: 17,
      consultationFee: 1200,
      rating: 4.9,
      totalReviews: 124,
      about: 'Senior Consultant Interventional Cardiologist at AIIMS. Specializes in angioplasty, pacemaker implantation, hypertension, and preventive cardiac wellness.',
    },
    // 2. Modinagar - General Physician
    {
      name: 'Dr. Vivek Tyagi',
      email: 'vivek.tyagi@careconnect.in',
      password: 'doctor123',
      phone: '+91 98371 44556',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80', // Indian Doctor portrait
      pincode: '201204',
      city: 'Modinagar',
      hospital: modiHospital,
      qualification: 'MBBS, MD (Medicine), C.Diab',
      specialization: 'General Medicine',
      experience: 14,
      consultationFee: 500,
      rating: 4.8,
      totalReviews: 88,
      about: 'Chief Medical Consultant at Modi Hospital Modinagar. Highly regarded for infectious disease treatment, diabetes reversal, and chronic lifestyle disease management.',
    },
    // 3. Ghaziabad - Gynecologist
    {
      name: 'Dr. Ananya Gupta',
      email: 'ananya.gupta@careconnect.in',
      password: 'doctor123',
      phone: '+91 98188 99887',
      avatar: 'https://images.unsplash.com/photo-1594824813576-9051d95b8d2b?auto=format&fit=crop&w=300&q=80', // Indian Female Doctor
      pincode: '201001',
      city: 'Ghaziabad',
      hospital: yashodaGzb,
      qualification: 'MBBS, MS (Obstetrics & Gynecology), DNB, FICOG',
      specialization: 'Gynecology & Obstetrics',
      experience: 15,
      consultationFee: 900,
      rating: 4.9,
      totalReviews: 102,
      about: 'Senior Gynecologist & Laparoscopic Surgeon at Yashoda Hospital Ghaziabad. Expert in high-risk pregnancies, normal painless deliveries, and PCOS management.',
    },
    // 4. Meerut - Orthopedic Surgeon
    {
      name: 'Dr. Amit Verma',
      email: 'amit.verma@careconnect.in',
      password: 'doctor123',
      phone: '+91 98372 11223',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80', // Indian Male Doctor smiling in scrubs
      pincode: '250004',
      city: 'Meerut',
      hospital: anandMeerut,
      qualification: 'MBBS, MS (Orthopedics), M.Ch (Joint Replacement)',
      specialization: 'Orthopedics',
      experience: 18,
      consultationFee: 800,
      rating: 4.9,
      totalReviews: 140,
      about: 'Chief Joint Reconstruction Surgeon at Anand Hospital Meerut. Performed over 3,000 successful robotic knee and hip replacements and complex fracture surgeries.',
    },
    // 5. Ghaziabad - Pediatrician
    {
      name: 'Dr. Sunita Chaudhary',
      email: 'sunita.chaudhary@careconnect.in',
      password: 'doctor123',
      phone: '+91 98112 77889',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80', // Indian Female Doctor
      pincode: '201010',
      city: 'Ghaziabad',
      hospital: maxVaishali,
      qualification: 'MBBS, MD (Pediatrics), Fellowship in Neonatal Intensive Care',
      specialization: 'Pediatrics',
      experience: 13,
      consultationFee: 800,
      rating: 4.9,
      totalReviews: 94,
      about: 'Senior Consultant Pediatrician at Max Hospital Vaishali. Dedicated to child growth monitoring, newborn intensive care, allergy prevention, and immunizations.',
    },
    // 6. Modinagar - Dermatologist
    {
      name: 'Dr. Neha Agarwal',
      email: 'neha.agarwal@careconnect.in',
      password: 'doctor123',
      phone: '+91 98373 66778',
      avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=300&q=80', // Indian Female Doctor
      pincode: '201204',
      city: 'Modinagar',
      hospital: srmHospital,
      qualification: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
      specialization: 'Dermatology',
      experience: 11,
      consultationFee: 600,
      rating: 4.8,
      totalReviews: 76,
      about: 'Clinical & Cosmetic Dermatologist at SRM Hospital Modinagar. Specializes in acne scar removal, laser skin resurfacing, psoriasis, and hair restoration therapies.',
    },
    // 7. Meerut - ENT Surgeon
    {
      name: 'Dr. Pradeep Tyagi',
      email: 'pradeep.tyagi@careconnect.in',
      password: 'doctor123',
      phone: '+91 98374 88990',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80', // Indian Male Physician
      pincode: '250005',
      city: 'Meerut',
      hospital: subhartiMeerut,
      qualification: 'MBBS, MS (ENT), Fellowship in Endoscopic Sinus Surgery',
      specialization: 'ENT (Otolaryngology)',
      experience: 16,
      consultationFee: 700,
      rating: 4.8,
      totalReviews: 68,
      about: 'Professor & Head of ENT at Subharti Medical College Hospital Meerut. Vast experience in micro-ear surgeries, cochlear implants, sinus endoscopy, and vertigo.',
    },
    // 8. Delhi - Neurologist
    {
      name: 'Dr. Vikramaditya Singh',
      email: 'vikram.singh@careconnect.in',
      password: 'doctor123',
      phone: '+91 98113 33445',
      avatar: 'https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&w=300&q=80', // Senior Indian Neurologist
      pincode: '110001',
      city: 'New Delhi',
      hospital: apolloDelhi,
      qualification: 'MBBS, MD, DM (Neurology)',
      specialization: 'Neurology',
      experience: 19,
      consultationFee: 1400,
      rating: 4.9,
      totalReviews: 115,
      about: 'Senior Neurologist at Apollo Hospital Delhi. Renowned specialist in stroke intervention, epilepsy management, Parkinson disease, and migraine therapies.',
    },
    // 9. Modinagar - Orthopedic Consultant
    {
      name: 'Dr. Manoj K. Bansal',
      email: 'manoj.bansal@careconnect.in',
      password: 'doctor123',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=300&q=80', // Indian Male Doctor
      pincode: '201204',
      city: 'Modinagar',
      hospital: modiHospital,
      qualification: 'MBBS, MS (Orthopedics), DNB Ortho',
      specialization: 'Orthopedics',
      experience: 16,
      consultationFee: 600,
      rating: 4.8,
      totalReviews: 82,
      about: 'Senior Consultant Orthopedic Surgeon in Modinagar. Specializes in fracture management, arthritis treatment, spine alignment, and sports medicine.',
    },
    // 10. Delhi - Pediatrician (Max Patparganj)
    {
      name: 'Dr. Kavita Mehra',
      email: 'kavita.mehra@careconnect.in',
      password: 'doctor123',
      phone: '+91 98114 55667',
      avatar: 'https://images.unsplash.com/photo-1594824813576-9051d95b8d2b?auto=format&fit=crop&w=300&q=80', // Indian Female Doctor
      pincode: '110092',
      city: 'New Delhi',
      hospital: maxPatparganj,
      qualification: 'MBBS, MD (Pediatrics), DCH, FIAP',
      specialization: 'Pediatrics',
      experience: 14,
      consultationFee: 1000,
      rating: 4.9,
      totalReviews: 110,
      about: 'Lead Pediatrician at Max Hospital Patparganj Delhi. Dedicated to infant nutrition, developmental milestones, pediatric allergy, and newborn preventive care.',
    },
    // 11. Ghaziabad - Senior Cardiologist (Manipal Hospital)
    {
      name: 'Dr. Alok Kumar Srivastava',
      email: 'alok.srivastava@careconnect.in',
      password: 'doctor123',
      phone: '+91 98180 33221',
      avatar: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=300&q=80', // Indian Male Doctor
      pincode: '201002',
      city: 'Ghaziabad',
      hospital: manipalGzb,
      qualification: 'MBBS, MD (Internal Medicine), DM (Cardiology)',
      specialization: 'Cardiology',
      experience: 17,
      consultationFee: 1100,
      rating: 4.9,
      totalReviews: 128,
      about: 'Principal Cardiologist at Manipal Hospital Ghaziabad. Expert in coronary angiography, complex angioplasty, heart failure, and lifestyle cardiology.',
    },
    // 12. Meerut - Eye Surgeon (Nutema Hospital)
    {
      name: 'Dr. Ritu Singhal',
      email: 'ritu.singhal@careconnect.in',
      password: 'doctor123',
      phone: '+91 98375 22110',
      avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=300&q=80', // Indian Female Doctor
      pincode: '250004',
      city: 'Meerut',
      hospital: nutemaMeerut,
      qualification: 'MBBS, MS (Ophthalmology), FICO (UK)',
      specialization: 'Ophthalmology',
      experience: 15,
      consultationFee: 750,
      rating: 4.9,
      totalReviews: 96,
      about: 'Senior Cataract, Cornea & Refractive Surgeon at Nutema Hospital Meerut. Performed over 5,000 phacoemulsification and modern LASIK eye surgeries.',
    },
  ];

  const createdDoctors = [];
  for (const docConfig of doctorsListConfig) {
    const user = await User.create({
      name: docConfig.name,
      email: docConfig.email,
      password: docConfig.password,
      phone: docConfig.phone,
      role: 'doctor',
      avatar: docConfig.avatar,
      city: docConfig.city,
      pincode: docConfig.pincode,
    });

    const doc = await Doctor.create({
      userId: user._id,
      hospitalId: docConfig.hospital._id,
      qualification: docConfig.qualification,
      specialization: docConfig.specialization,
      experience: docConfig.experience,
      consultationFee: docConfig.consultationFee,
      about: docConfig.about,
      rating: docConfig.rating,
      totalReviews: docConfig.totalReviews,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      shift: 'Both',
      startHour: '09:00 AM',
      endHour: '05:00 PM',
      breakStart: '01:00 PM',
      breakEnd: '02:00 PM',
      slotDuration: 30,
      isVerified: true,
      isActive: true,
    });

    createdDoctors.push(doc);
  }

  // 6. Generate Availabilities & Slots for doctors for upcoming dates
  console.log('Generating Doctor Slots for upcoming dates...');
  const today = new Date();
  const dateStrings = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dateStrings.push(d.toISOString().split('T')[0]);
  }

  for (const doc of createdDoctors) {
    for (const dStr of dateStrings) {
      const generated = generateTimeSlots('09:00 AM', '05:00 PM', 30, '01:00 PM', '02:00 PM');
      await Availability.create({
        doctorId: doc._id,
        date: dStr,
        dayOfWeek: new Date(dStr).toLocaleDateString('en-US', { weekday: 'long' }),
        shift: 'Both',
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        breakStartTime: '01:00 PM',
        breakEndTime: '02:00 PM',
        slotDuration: 30,
        slots: generated,
        isAvailable: true,
      });
    }
  }

  // 7. Sample Appointments
  console.log('Creating Initial Consultations and Prescriptions...');
  const drRajesh = createdDoctors[0]; // Delhi Cardiology
  const drVivek = createdDoctors[1];  // Modinagar Medicine
  const drAmit = createdDoctors[3];   // Meerut Orthopedics

  // Appointment 1: Completed with Prescription and Review (Modinagar visit)
  const apt1 = await Appointment.create({
    appointmentNumber: 'CC-2026-1001',
    patientId: patient1._id,
    doctorId: drVivek._id,
    hospitalId: modiHospital._id,
    date: dateStrings[0],
    timeSlot: '10:30 AM',
    symptoms: 'High grade fever with chills, body ache, mild cough for 3 days',
    notes: 'Patient resides in Modinagar near KNMIET campus.',
    fee: drVivek.consultationFee,
    status: 'completed',
    paymentStatus: 'paid',
    hasPrescription: true,
    isReviewed: true,
  });

  await Availability.findOneAndUpdate(
    { doctorId: drVivek._id, date: dateStrings[0], 'slots.time': '10:30 AM' },
    { $set: { 'slots.$.isBooked': true, 'slots.$.appointmentId': apt1._id } }
  );

  await Prescription.create({
    appointmentId: apt1._id,
    patientId: patient1._id,
    doctorId: drVivek._id,
    hospitalId: modiHospital._id,
    symptoms: apt1.symptoms,
    diagnosis: 'Acute Viral Fever with Upper Respiratory Tract Infection',
    doctorNotes: 'Adequate oral hydration (3 liters/day), complete bed rest. If fever exceeds 102°F, take paracetamol.',
    medicines: [
      {
        name: 'Paracetamol (Dolo 650)',
        dosage: '650 mg',
        frequency: '1-0-1 (Twice daily after food)',
        duration: '5 Days',
        instructions: 'Take with warm water',
      },
      {
        name: 'Azithromycin (Azithral)',
        dosage: '500 mg',
        frequency: '1-0-0 (Once daily before breakfast)',
        duration: '3 Days',
        instructions: 'Complete full 3-day course',
      },
      {
        name: 'Pantoprazole (Pan 40)',
        dosage: '40 mg',
        frequency: '1-0-0 (Morning empty stomach)',
        duration: '5 Days',
        instructions: 'Take 30 mins before breakfast',
      },
    ],
    testsRecommended: ['Complete Blood Count (CBC)', 'Dengue Serology NS1'],
    dietaryAdvice: 'Soft light diet, coconut water, fresh soup. Avoid cold beverages.',
    followUpDate: dateStrings[4],
  });

  await Review.create({
    appointmentId: apt1._id,
    patientId: patient1._id,
    doctorId: drVivek._id,
    rating: 5,
    comment:
      'Dr. Vivek Tyagi is one of the best doctors in Modinagar! Very patient listener, diagnosis was spot on, and I recovered within 3 days.',
  });

  // Appointment 2: Confirmed Upcoming Appointment (Meerut Ortho)
  const apt2 = await Appointment.create({
    appointmentNumber: 'CC-2026-1002',
    patientId: patient3._id,
    doctorId: drAmit._id,
    hospitalId: anandMeerut._id,
    date: dateStrings[1],
    timeSlot: '11:00 AM',
    symptoms: 'Knee joint pain while walking stairs, swelling and morning stiffness',
    notes: 'Patient visiting Anand Hospital Garh Road Meerut.',
    fee: drAmit.consultationFee,
    status: 'confirmed',
    paymentStatus: 'paid',
  });

  await Availability.findOneAndUpdate(
    { doctorId: drAmit._id, date: dateStrings[1], 'slots.time': '11:00 AM' },
    { $set: { 'slots.$.isBooked': true, 'slots.$.appointmentId': apt2._id } }
  );

  // 8. Notifications
  console.log('Creating In-App Notifications...');
  await Notification.create([
    {
      userId: patient1._id,
      type: 'prescription_added',
      title: 'Digital Prescription Available',
      message: `Dr. Vivek Tyagi (Modi Hospital) has issued your electronic prescription for appointment #${apt1.appointmentNumber}.`,
      link: '/patient/prescriptions',
      isRead: false,
    },
    {
      userId: patient3._id,
      type: 'appointment_confirmed',
      title: 'Appointment Confirmed at Anand Hospital',
      message: `Your consultation with Dr. Amit Verma (Garh Road, Meerut) on ${dateStrings[1]} at 11:00 AM has been confirmed.`,
      link: '/patient/appointments',
      isRead: false,
    },
    {
      userId: drVivek.userId,
      type: 'review_received',
      title: 'New 5-Star Patient Review',
      message: 'Rahul Sharma left a 5-star rating for their consultation at Modi Hospital Modinagar.',
      link: '/doctor/reviews',
      isRead: true,
    },
  ]);

  console.log('=======================================================');
  console.log(' CARE CONNECT - DATABASE SEEDED SUCCESSFULLY');
  console.log(' Locations: Delhi, Modinagar, Ghaziabad, Meerut');
  console.log(' Dummy Connect Helpline: +91 98765 43210 | connect@careconnect.in');
  console.log('=======================================================');
  console.log('DEMO TEST LOGINS:');
  console.log('1. Admin:   admin@hospital.com   / Anupam@9642');
  console.log('2. Doctor:  doctor@hospital.com  / doctor123');
  console.log('3. Patient: patient@hospital.com / patient123');
  console.log('=======================================================');

  if (standalone) {
    await disconnectDB();
    process.exit(0);
  }
}

if (require.main === module) {
  seedData(true).catch((err) => {
    console.error('Seeder failed:', err);
    process.exit(1);
  });
}

module.exports = { seedData };
