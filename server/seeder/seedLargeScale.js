const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
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

// ==========================================
// 1. DATA SOURCES: INDIAN CITIES & HUBS (200 HOSPITALS)
// ==========================================

const CITIES_DATA = [
  // Delhi NCR
  { city: 'New Delhi', state: 'Delhi', pincodes: ['110001', '110002', '110003', '110005', '110011', '110020', '110025', '110029', '110048', '110075', '110085', '110092'], lat: 28.6139, lng: 77.2090 },
  { city: 'Ghaziabad', state: 'Uttar Pradesh', pincodes: ['201001', '201002', '201005', '201009', '201010', '201012', '201014'], lat: 28.6692, lng: 77.4538 },
  { city: 'Noida', state: 'Uttar Pradesh', pincodes: ['201301', '201303', '201304', '201307', '201310'], lat: 28.5355, lng: 77.3910 },
  { city: 'Greater Noida', state: 'Uttar Pradesh', pincodes: ['201306', '201308', '201310'], lat: 28.4744, lng: 77.5040 },
  { city: 'Gurugram', state: 'Haryana', pincodes: ['122001', '122002', '122003', '122018', '122051'], lat: 28.4595, lng: 77.0266 },
  { city: 'Faridabad', state: 'Haryana', pincodes: ['121001', '121002', '121006', '121007'], lat: 28.4089, lng: 77.3178 },
  { city: 'Meerut', state: 'Uttar Pradesh', pincodes: ['250001', '250002', '250004', '250005'], lat: 28.9845, lng: 77.7064 },
  { city: 'Modinagar', state: 'Uttar Pradesh', pincodes: ['201204', '201201'], lat: 28.8315, lng: 77.5831 },
  // Major Metros
  { city: 'Mumbai', state: 'Maharashtra', pincodes: ['400001', '400012', '400050', '400076', '400092'], lat: 19.0760, lng: 72.8777 },
  { city: 'Bengaluru', state: 'Karnataka', pincodes: ['560001', '560034', '560066', '560076', '560100'], lat: 12.9716, lng: 77.5946 },
  { city: 'Hyderabad', state: 'Telangana', pincodes: ['500001', '500034', '500081', '500032', '500072'], lat: 17.3850, lng: 78.4867 },
  { city: 'Chennai', state: 'Tamil Nadu', pincodes: ['600001', '600006', '600020', '600040', '600096'], lat: 13.0827, lng: 80.2707 },
  { city: 'Kolkata', state: 'West Bengal', pincodes: ['700001', '700019', '700029', '700091', '700156'], lat: 22.5726, lng: 88.3639 },
  { city: 'Pune', state: 'Maharashtra', pincodes: ['411001', '411005', '411014', '411028', '411057'], lat: 18.5204, lng: 73.8567 },
  { city: 'Ahmedabad', state: 'Gujarat', pincodes: ['380001', '380006', '380015', '380054'], lat: 23.0225, lng: 72.5714 },
  { city: 'Jaipur', state: 'Rajasthan', pincodes: ['302001', '302004', '302017', '302020'], lat: 26.9124, lng: 75.7873 },
  { city: 'Lucknow', state: 'Uttar Pradesh', pincodes: ['226001', '226010', '226016', '226024'], lat: 26.8467, lng: 80.9462 },
  { city: 'Chandigarh', state: 'Chandigarh', pincodes: ['160001', '160017', '160022', '160036'], lat: 30.7333, lng: 76.7794 },
  { city: 'Bhopal', state: 'Madhya Pradesh', pincodes: ['462001', '462016', '462026'], lat: 23.2599, lng: 77.4126 },
  { city: 'Patna', state: 'Bihar', pincodes: ['800001', '800014', '800020'], lat: 25.5941, lng: 85.1376 },
  { city: 'Kochi', state: 'Kerala', pincodes: ['682001', '682016', '682024'], lat: 9.9312, lng: 76.2673 },
  { city: 'Indore', state: 'Madhya Pradesh', pincodes: ['452001', '452010', '452016'], lat: 22.7196, lng: 75.8577 },
];

const HOSPITAL_BRANDS = [
  'Apollo Super Speciality Hospital',
  'Max Healthcare Institute',
  'Fortis Memorial Multi-Speciality Hospital',
  'Medanta The Medicity',
  'AIIMS Apex Healthcare & Research Hospital',
  'Manipal Super Speciality Hospital',
  'Columbia Asia Comprehensive Medical Centre',
  'Artemis Health Institute',
  'Yashoda Super Speciality Hospital',
  'BLK-Max Centre for Advanced Medicine',
  'Sir Ganga Ram Multi-Speciality Hospital',
  'Narayana Health City',
  'Aster Prime Hospital',
  'Ruby Hall Multi-Speciality Clinic',
  'Lilavati Hospital & Research Centre',
  'Kokilaben Dhirubhai Ambani Hospital',
  'KIMS Super Speciality Hospital',
  'CARE Hospital & Heart Institute',
  'Sunshine Multi-Speciality Hospital',
  'Cloudnine Hospital for Women & Children',
  'Motherhood Maternity & Child Hospital',
  'Rainbow Children\'s Hospital & BirthRight',
  'Wockhardt Advanced Medical Centre',
  'Sahyadri Super Speciality Hospital',
  'Jaypee Hospital & Heart Institute',
  'Sharda Multi-Speciality Teaching Hospital',
  'Santosh Medical College & Hospital',
  'Modi Healthcare Multi-Speciality Hospital',
  'Anand Hospital & Trauma Centre',
  'Popular Super Speciality Hospital',
  'Metro Hospital & Heart Institute',
  'Sarvodaya Super Speciality Hospital',
  'QRG Central Hospital & Research Centre',
  'Kailash Hospital & Neuro Institute',
  'Paras Health & Super Speciality Hospital',
  'Marengo Asia Healthcare Hospital',
];

const HOSPITAL_AREAS = [
  'Medical Square', 'Health City', 'Central Avenue', 'Civil Lines', 'Connaught Circle',
  'Ring Road Hub', 'Technology Corridor', 'University Enclave', 'Expressway Sector',
  'Green Valley Zone', 'Heritage Park', 'Riverside Road', 'Apex Healthcare Hub',
  'Metro Pillar Boulevard', 'Capital District', 'Airport Expressway Junction',
];

const HOSPITAL_IMAGES = [
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80',
];

const SPECIALIZATIONS_MASTER = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'Gynecology & Obstetrics',
  'General Medicine',
  'ENT (Otolaryngology)',
  'Ophthalmology',
];

const DOCTOR_FIRST_NAMES_MALE = [
  'Ramesh', 'Suresh', 'Amit', 'Rajesh', 'Vikram', 'Arvind', 'Sunil', 'Anil', 'Alok', 'Manoj',
  'Rohan', 'Kunal', 'Deepak', 'Naveen', 'Sanjay', 'Pankaj', 'Abhishek', 'Gaurav', 'Manish', 'Vivek',
  'Ashok', 'Harish', 'Sachin', 'Nitin', 'Prateek', 'Shantanu', 'Virendra', 'Raghav', 'Ajay', 'Devendra',
  'Rakesh', 'Mahesh', 'Mohan', 'Dinesh', 'Hemant', 'Kishore', 'Sudhir', 'Brijesh', 'Vinod', 'Anurag',
  'Tarun', 'Nikhil', 'Praveen', 'Siddharth', 'Varun', 'Kartik', 'Tushar', 'Aditya', 'Samir', 'Mayank',
];

const DOCTOR_FIRST_NAMES_FEMALE = [
  'Priya', 'Sunita', 'Anita', 'Neha', 'Pooja', 'Ananya', 'Meenakshi', 'Shalini', 'Kavita', 'Ritu',
  'Swati', 'Sangeeta', 'Rekha', 'Archana', 'Bhavna', 'Rashmi', 'Divya', 'Preeti', 'Deepa', 'Suman',
  'Shikha', 'Aarti', 'Manju', 'Vandana', 'Pallavi', 'Tanvi', 'Komal', 'Prachi', 'Radhika', 'Smita',
  'Madhu', 'Sneha', 'Geeta', 'Monika', 'Seema', 'Richa', 'Shreya', 'Jyoti', 'Garima', 'Nidhi',
  'Vaidehi', 'Aparna', 'Chandana', 'Simran', 'Ishita', 'Charu', 'Rupali', 'Payal', 'Ipsita', 'Urvi',
];

const DOCTOR_LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Mishra', 'Joshi', 'Trivedi', 'Yadav',
  'Nair', 'Iyer', 'Menon', 'Rao', 'Reddy', 'Chawla', 'Kapoor', 'Malhotra', 'Khanna', 'Mehta',
  'Shah', 'Deshmukh', 'Kulkarni', 'Patil', 'Banerjee', 'Chatterjee', 'Mukherjee', 'Bose', 'Sen', 'Ghosh',
  'Bhatia', 'Aggarwal', 'Sethi', 'Bansal', 'Goyal', 'Saxena', 'Srivastava', 'Pandey', 'Dubey', 'Chaturvedi',
  'Choudhary', 'Rathore', 'Mathur', 'Sood', 'Puri', 'Bahl', 'Lamba', 'Grover', 'Dhawan', 'Bajaj',
];

const QUALIFICATIONS_BY_SPEC = {
  Cardiology: ['MBBS, MD (Medicine), DM (Cardiology)', 'MBBS, DNB (Cardiology), FACC', 'MBBS, MD, MCh (Cardiothoracic Surgery)'],
  Neurology: ['MBBS, MD, DM (Neurology)', 'MBBS, MS, MCh (Neurosurgery)', 'MBBS, DNB (Neurology), FINR'],
  Orthopedics: ['MBBS, MS (Orthopedics)', 'MBBS, DNB (Ortho), Fellowship in Joint Replacement', 'MBBS, MS (Ortho), MCh'],
  Pediatrics: ['MBBS, MD (Pediatrics)', 'MBBS, DNB (Pediatrics), Fellowship in Neonatology', 'MBBS, MD (Pediatrics), FIAP'],
  Dermatology: ['MBBS, MD (Dermatology, Venereology & Leprosy)', 'MBBS, DVD, DNB (Dermatology)', 'MBBS, MD (Skin), FAM'],
  'Gynecology & Obstetrics': ['MBBS, MS (OBGYN), DGO', 'MBBS, MD (Obstetrics & Gynecology), FICOG', 'MBBS, DNB (OBGYN), Fellow in Infertility'],
  'General Medicine': ['MBBS, MD (General Medicine)', 'MBBS, DNB (Internal Medicine), MNAMS', 'MBBS, MD, Post Graduate Diploma in Diabetology'],
  'ENT (Otolaryngology)': ['MBBS, MS (ENT)', 'MBBS, DLO, DNB (Otolaryngology)', 'MBBS, MS (ENT), Fellowship in Endoscopic Sinus Surgery'],
  Ophthalmology: ['MBBS, MS (Ophthalmology)', 'MBBS, DNB (Ophthalmology), FICO (UK)', 'MBBS, MS (Eye), Fellowship in Cornea & Refractive'],
};

const DOCTOR_AVATARS_MALE = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
];

const DOCTOR_AVATARS_FEMALE = [
  'https://images.unsplash.com/photo-1594824813512-257a70a8d4fa?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=300&q=80',
];

// Helper: Format Date YYYY-MM-DD
function getNextDates(count = 4) {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

// ==========================================
// SEED RUNNER
// ==========================================

async function seedLargeScaleDataset(standalone = true) {
  console.log('========================================================');
  console.log(' CARE CONNECT - ENTERPRISE LARGE DATASET SEEDER');
  console.log(' Target: 200 Hospitals, 1000 Verified Specialist Doctors');
  console.log('========================================================');

  await connectDB();

  // 1. Wipe collections cleanly except preserve existing non-doctor patients/admin if wanted,
  // or cleanly reconstruct everything with standard login accounts included.
  console.log('Cleaning old records...');
  await Promise.all([
    Hospital.deleteMany({}),
    Doctor.deleteMany({}),
    Availability.deleteMany({}),
    User.deleteMany({}),
    Appointment.deleteMany({}),
    Prescription.deleteMany({}),
    Review.deleteMany({}),
    Notification.deleteMany({}),
    Specialization.deleteMany({}),
  ]);
  console.log('Collections cleared.');

  // Pre-hash default passwords to save CPU
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordDoctor = await bcrypt.hash('doctor123', 10);
  const hashedPasswordPatient = await bcrypt.hash('patient123', 10);

  // 2. Insert Specializations
  console.log('Inserting Specializations...');
  const specDocs = await Specialization.insertMany(
    SPECIALIZATIONS_MASTER.map((name) => ({
      name,
      description: `Comprehensive diagnostic, therapeutic, and preventive care in ${name}.`,
      icon: 'Activity',
      popularTreatments: ['Initial Consultation', 'Specialist Diagnostic Review', 'Follow-up Treatment Protocol'],
    }))
  );

  // 3. Create Core Master Accounts
  console.log('Creating Core Demo Accounts...');
  const adminUser = await User.create({
    name: 'Care Connect Administrator',
    email: 'admin@hospital.com',
    password: hashedPasswordAdmin,
    role: 'admin',
    phone: '+91 98765 00001',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
  });

  const primaryPatient = await User.create({
    name: 'Rahul Sharma',
    email: 'patient@hospital.com',
    password: hashedPasswordPatient,
    role: 'patient',
    phone: '+91 98111 22233',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110029',
    gender: 'Male',
  });

  // 4. Generate 200 Hospitals
  console.log('Generating 200 Hospitals across Indian healthcare hubs...');
  const hospitalList = [];
  let hospCounter = 1;

  for (let i = 0; i < 200; i++) {
    const cityInfo = CITIES_DATA[i % CITIES_DATA.length];
    const brand = HOSPITAL_BRANDS[i % HOSPITAL_BRANDS.length];
    const area = HOSPITAL_AREAS[i % HOSPITAL_AREAS.length];
    const pincode = cityInfo.pincodes[i % cityInfo.pincodes.length];

    // Jitter coordinates slightly around city center (~2-8km)
    const latOffset = (Math.sin(i * 1.7) * 0.045);
    const lngOffset = (Math.cos(i * 1.3) * 0.045);

    hospitalList.push({
      name: `${brand} - ${cityInfo.city} ${area}`,
      email: `care.hosp${hospCounter}@careconnect.in`,
      contactNumber: `+91 ${cityInfo.pincodes[0].substring(0, 2)} ${Math.floor(20000000 + Math.random() * 70000000)}`,
      address: `Plot No. ${10 + (i % 80)}, Sector ${1 + (i % 65)}, ${area}`,
      area: `${area}, ${cityInfo.city}`,
      city: cityInfo.city,
      state: cityInfo.state,
      pincode: pincode,
      location: {
        type: 'Point',
        coordinates: [
          parseFloat((cityInfo.lng + lngOffset).toFixed(4)),
          parseFloat((cityInfo.lat + latOffset).toFixed(4)),
        ],
      },
      departments: [
        'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
        'Dermatology', 'Gynecology & Obstetrics', 'General Medicine',
        'ENT (Otolaryngology)', 'Ophthalmology',
      ],
      facilities: [
        'Level 1 / 2 Trauma Centre',
        '24/7 Digital Pathology & Radiology',
        'Multi-Slice CT & 3T MRI',
        'NABH Accredited ICU / NICU',
        '24 Hours Emergency Blood Bank',
        'Robotic Surgery Unit',
        'Fully Stocked 24x7 Pharmacy',
      ],
      openingHours: '24 Hours Emergency / OPD: 08:30 AM - 08:00 PM',
      rating: parseFloat((4.6 + (i % 5) * 0.08).toFixed(1)),
      totalReviews: 30 + (i * 7) % 350,
      image: HOSPITAL_IMAGES[i % HOSPITAL_IMAGES.length],
      isActive: true,
    });
    hospCounter++;
  }

  const savedHospitals = await Hospital.insertMany(hospitalList);
  console.log(`Successfully created ${savedHospitals.length} Hospitals in MongoDB.`);

  // 5. Generate 1000 Doctors with Users
  console.log('Generating 1000 Doctors and User Accounts...');
  const userDocs = [];
  const doctorMetadata = [];

  for (let i = 0; i < 1000; i++) {
    const isMale = i % 2 === 0;
    const firstName = isMale
      ? DOCTOR_FIRST_NAMES_MALE[i % DOCTOR_FIRST_NAMES_MALE.length]
      : DOCTOR_FIRST_NAMES_FEMALE[i % DOCTOR_FIRST_NAMES_FEMALE.length];
    const lastName = DOCTOR_LAST_NAMES[(i * 3) % DOCTOR_LAST_NAMES.length];
    const fullName = `Dr. ${firstName} ${lastName}`;
    const specialization = SPECIALIZATIONS_MASTER[i % SPECIALIZATIONS_MASTER.length];
    const qualifications = QUALIFICATIONS_BY_SPEC[specialization] || ['MBBS, MD'];
    const qualification = qualifications[i % qualifications.length];
    const hospital = savedHospitals[i % savedHospitals.length];

    // Give doctor index 0 the standard demo email doctor@hospital.com
    const email = i === 0
      ? 'doctor@hospital.com'
      : `dr.${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i + 1}@careconnect.in`;

    const avatar = isMale
      ? DOCTOR_AVATARS_MALE[i % DOCTOR_AVATARS_MALE.length]
      : DOCTOR_AVATARS_FEMALE[i % DOCTOR_AVATARS_FEMALE.length];

    userDocs.push({
      _id: new mongoose.Types.ObjectId(),
      name: fullName,
      email: email,
      password: hashedPasswordDoctor,
      phone: `+91 ${9800000000 + i}`,
      role: 'doctor',
      avatar: avatar,
      city: hospital.city,
      state: hospital.state,
      pincode: hospital.pincode,
      gender: isMale ? 'Male' : 'Female',
    });

    doctorMetadata.push({
      userIndex: i,
      hospitalId: hospital._id,
      qualification,
      specialization,
      experience: 4 + (i % 28), // 4 to 31 years
      consultationFee: 400 + (i % 18) * 100, // 400 to 2100
      licenseNumber: `MCI-${20000 + i}`,
      shift: i % 3 === 0 ? 'Morning' : i % 3 === 1 ? 'Evening' : 'Both',
      startHour: i % 3 === 1 ? '02:00 PM' : '09:00 AM',
      endHour: i % 3 === 1 ? '08:00 PM' : '05:00 PM',
      breakStart: '01:00 PM',
      breakEnd: '02:00 PM',
      slotDuration: 30,
      rating: parseFloat((4.7 + (i % 4) * 0.08).toFixed(1)),
      totalReviews: 12 + (i % 180),
      about: `Dr. ${firstName} ${lastName} is a renowned ${specialization} specialist affiliated with ${hospital.name}. With over ${4 + (i % 28)} years of clinical experience, they specialize in diagnostic precision, advanced therapies, and empathetic patient care.`,
      awards: [
        `Distinguished Service in ${specialization}`,
        'Indian Medical Association Clinical Excellence Citation',
      ],
    });
  }

  // Insert 1000 Users in batches
  console.log('Inserting 1000 Doctor User records...');
  const savedUsers = await User.insertMany(userDocs, { ordered: true });

  // Map to Doctor records
  const doctorDocs = doctorMetadata.map((meta, idx) => ({
    _id: new mongoose.Types.ObjectId(),
    userId: savedUsers[idx]._id,
    hospitalId: meta.hospitalId,
    qualification: meta.qualification,
    specialization: meta.specialization,
    experience: meta.experience,
    consultationFee: meta.consultationFee,
    medicalLicenseNumber: meta.licenseNumber,
    shift: meta.shift,
    startHour: meta.startHour,
    endHour: meta.endHour,
    breakStart: meta.breakStart,
    breakEnd: meta.breakEnd,
    slotDuration: meta.slotDuration,
    rating: meta.rating,
    totalReviews: meta.totalReviews,
    about: meta.about,
    awards: meta.awards,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    isVerified: true,
    isActive: true,
  }));

  console.log('Inserting 1000 Doctor profile records...');
  const savedDoctors = await Doctor.insertMany(doctorDocs, { ordered: true });
  console.log(`Successfully created ${savedDoctors.length} Doctors in MongoDB.`);

  // 6. Generate Consultation Slots for the next 3 days
  console.log('Initializing working booking slots (Availabilities) for doctors...');
  const dates = getNextDates(3);
  const availabilityDocs = [];

  for (let i = 0; i < savedDoctors.length; i++) {
    const doc = savedDoctors[i];
    const generatedSlots = generateTimeSlots(
      doc.startHour,
      doc.endHour,
      doc.slotDuration,
      doc.breakStart,
      doc.breakEnd
    );

    for (const d of dates) {
      availabilityDocs.push({
        doctorId: doc._id,
        date: d,
        shift: doc.shift,
        startTime: doc.startHour,
        endTime: doc.endHour,
        breakStartTime: doc.breakStart,
        breakEndTime: doc.breakEnd,
        slotDuration: doc.slotDuration,
        isAvailable: true,
        slots: generatedSlots,
      });
    }
  }

  // Batch insert availabilities
  console.log(`Inserting ${availabilityDocs.length} availability records in batches...`);
  const BATCH_SIZE = 500;
  for (let i = 0; i < availabilityDocs.length; i += BATCH_SIZE) {
    const batch = availabilityDocs.slice(i, i + BATCH_SIZE);
    await Availability.insertMany(batch, { ordered: false });
  }
  console.log('Availabilities successfully initialized.');

  // 7. Create Sample Working Appointments & Reviews
  console.log('Creating Sample Verified Appointments...');
  const primaryDoctor = savedDoctors[0]; // dr. Ramesh Sharma / doctor@hospital.com
  const primaryHospital = savedHospitals[0];

  const apt1 = await Appointment.create({
    appointmentNumber: 'CC-2026-1001',
    patientId: primaryPatient._id,
    doctorId: primaryDoctor._id,
    hospitalId: primaryHospital._id,
    date: dates[0],
    timeSlot: '10:00 AM',
    symptoms: 'Routine diagnostic review and cardiovascular consultation',
    notes: 'Patient requested consultation at ' + primaryHospital.name,
    fee: primaryDoctor.consultationFee,
    status: 'completed',
    paymentStatus: 'paid',
  });

  // Mark slot booked
  await Availability.findOneAndUpdate(
    { doctorId: primaryDoctor._id, date: dates[0], 'slots.time': '10:00 AM' },
    { $set: { 'slots.$.isBooked': true, 'slots.$.appointmentId': apt1._id } }
  );

  await Prescription.create({
    appointmentId: apt1._id,
    patientId: primaryPatient._id,
    doctorId: primaryDoctor._id,
    diagnosis: 'Mild hypertension - Stage 1',
    vitalSigns: { bp: '130/85 mmHg', pulse: '76 bpm', weight: '71 kg', temperature: '98.4 F' },
    medications: [
      {
        name: 'Telmisartan (Telma 40)',
        dosage: '40 mg',
        frequency: '1-0-0 (Morning)',
        duration: '30 Days',
        instructions: 'Take after breakfast',
      },
    ],
    testsRecommended: ['Lipid Profile', 'ECG 12-Lead'],
    dietaryAdvice: 'Low sodium diet, 30 min daily brisk walking.',
    followUpDate: dates[2],
  });

  await Review.create({
    appointmentId: apt1._id,
    patientId: primaryPatient._id,
    doctorId: primaryDoctor._id,
    rating: 5,
    comment: 'Exceptional care, clear diagnosis, and prompt guidance. Highly recommended specialist!',
  });

  await Notification.create([
    {
      userId: primaryPatient._id,
      type: 'prescription_added',
      title: 'Digital Prescription Available',
      message: `Dr. ${savedUsers[0].name || 'Specialist'} has issued your digital prescription for appointment #${apt1.appointmentNumber}.`,
      link: '/patient/prescriptions',
      isRead: false,
    },
    {
      userId: savedUsers[0]._id,
      type: 'review_received',
      title: 'New 5-Star Patient Review',
      message: 'Rahul Sharma left a 5-star rating for their consultation.',
      link: '/doctor/reviews',
      isRead: true,
    },
  ]);

  console.log('========================================================');
  console.log(' DATASET SEED COMPLETE:');
  console.log(` - Hospitals: ${await Hospital.countDocuments()}`);
  console.log(` - Doctors:   ${await Doctor.countDocuments()}`);
  console.log(` - Users:     ${await User.countDocuments()}`);
  console.log(` - Slots/Day: ${await Availability.countDocuments()}`);
  console.log('========================================================');
  console.log('DEMO LOGINS:');
  console.log('1. Admin:   admin@hospital.com   / admin123');
  console.log('2. Doctor:  doctor@hospital.com  / doctor123');
  console.log('3. Patient: patient@hospital.com / patient123');
  console.log('========================================================');

  if (standalone) {
    await disconnectDB();
    process.exit(0);
  }
}

if (require.main === module) {
  seedLargeScaleDataset(true).catch((err) => {
    console.error('Large Scale Seeder failed:', err);
    process.exit(1);
  });
}

module.exports = { seedLargeScaleDataset };
