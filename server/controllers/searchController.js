const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const {
  PINCODE_DATABASE,
  getPincodeInfo,
  calculateDistance,
  getNearbyPincodes,
  searchPincodes,
} = require('../utils/pincodeHelper');

// @desc    Search doctors with advanced filters & Pincode / Geo proximity
// @route   GET /api/search/doctors
// @access  Public
exports.searchDoctors = async (req, res, next) => {
  try {
    const {
      pincode,
      radius = '30', // in km (0 for exact pincode only)
      specialization,
      query,
      city,
      minFee,
      maxFee,
      minExperience,
      minRating,
      hospitalId,
      sortBy = 'nearest',
    } = req.query;

    const parsedRadius = parseFloat(radius);
    const targetPincodeInfo = pincode ? getPincodeInfo(pincode) : null;

    // Build initial doctor query
    const doctorFilter = {
      isActive: true,
      isVerified: true,
    };

    if (specialization && specialization !== 'All') {
      doctorFilter.specialization = new RegExp(specialization, 'i');
    }

    if (minFee || maxFee) {
      doctorFilter.consultationFee = {};
      if (minFee) doctorFilter.consultationFee.$gte = Number(minFee);
      if (maxFee) doctorFilter.consultationFee.$lte = Number(maxFee);
    }

    if (minExperience) {
      doctorFilter.experience = { $gte: Number(minExperience) };
    }

    if (minRating) {
      doctorFilter.rating = { $gte: Number(minRating) };
    }

    if (hospitalId) {
      doctorFilter.hospitalId = hospitalId;
    }

    // Fetch doctors populated with User and Hospital
    let doctors = await Doctor.find(doctorFilter)
      .populate('userId', 'name email phone avatar address city state pincode')
      .populate('hospitalId');

    // Filter out any where user is deactivated/blocked
    doctors = doctors.filter((doc) => doc.userId && !doc.userId.isBlocked && doc.hospitalId && doc.hospitalId.isActive);

    // Text search filter (matches doctor name, hospital name, area, qualification)
    if (query && query.trim() !== '') {
      const q = query.trim().toLowerCase();
      doctors = doctors.filter((doc) => {
        const nameMatch = doc.userId.name.toLowerCase().includes(q);
        const specMatch = doc.specialization.toLowerCase().includes(q);
        const qualMatch = doc.qualification.toLowerCase().includes(q);
        const hospMatch = doc.hospitalId.name.toLowerCase().includes(q);
        const areaMatch = (doc.hospitalId.area || '').toLowerCase().includes(q);
        const cityMatch = doc.hospitalId.city.toLowerCase().includes(q);
        return nameMatch || specMatch || qualMatch || hospMatch || areaMatch || cityMatch;
      });
    }

    // City filter
    if (city && city !== 'All') {
      doctors = doctors.filter(
        (doc) => doc.hospitalId.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Pincode & Distance Calculations
    const processedDoctors = doctors.map((doc) => {
      const docObj = doc.toObject();
      const hospitalPincode = doc.hospitalId ? doc.hospitalId.pincode : '';
      let distanceKm = null;
      let isExactPincode = false;

      if (pincode) {
        const cleanedTargetPincode = pincode.toString().trim();
        isExactPincode = hospitalPincode === cleanedTargetPincode;

        if (targetPincodeInfo && doc.hospitalId && doc.hospitalId.location && doc.hospitalId.location.coordinates) {
          const [hospLng, hospLat] = doc.hospitalId.location.coordinates;
          distanceKm = calculateDistance(
            targetPincodeInfo.lat,
            targetPincodeInfo.lng,
            hospLat,
            hospLng
          );
        } else if (isExactPincode) {
          distanceKm = 0;
        }
      }

      return {
        ...docObj,
        distanceKm,
        isExactPincode,
        hospitalPincode,
        hospitalArea: doc.hospitalId ? doc.hospitalId.area : '',
      };
    });

    // Pincode proximity filter
    let finalDoctors = processedDoctors;
    if (pincode) {
      if (parsedRadius === 0) {
        // Exact pincode match only
        finalDoctors = processedDoctors.filter((doc) => doc.isExactPincode);
      } else if (!isNaN(parsedRadius) && parsedRadius > 0) {
        // Within radius in KM
        finalDoctors = processedDoctors.filter(
          (doc) => doc.distanceKm !== null && doc.distanceKm <= parsedRadius
        );
      }
    }

    // Sorting
    finalDoctors.sort((a, b) => {
      if (sortBy === 'nearest' && pincode) {
        // Exact matches first, then by ascending distance
        if (a.isExactPincode && !b.isExactPincode) return -1;
        if (!a.isExactPincode && b.isExactPincode) return 1;
        if (a.distanceKm !== null && b.distanceKm !== null) {
          return a.distanceKm - b.distanceKm;
        }
      } else if (sortBy === 'fee_asc') {
        return a.consultationFee - b.consultationFee;
      } else if (sortBy === 'fee_desc') {
        return b.consultationFee - a.consultationFee;
      } else if (sortBy === 'rating_desc') {
        return b.rating - a.rating;
      } else if (sortBy === 'experience_desc') {
        return b.experience - a.experience;
      }
      return 0;
    });

    res.status(200).json({
      success: true,
      count: finalDoctors.length,
      searchedPincode: pincode || null,
      targetPincodeInfo,
      radiusKm: parsedRadius,
      sortBy,
      data: finalDoctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all supported pincodes with doctor & hospital stats
// @route   GET /api/search/pincodes
// @access  Public
exports.getPincodes = async (req, res, next) => {
  try {
    const { query } = req.query;
    let list = searchPincodes(query || '');

    // Enrich with count of hospitals in each pincode
    const hospitals = await Hospital.find({ isActive: true });
    const pincodeHospitalCount = {};
    hospitals.forEach((h) => {
      pincodeHospitalCount[h.pincode] = (pincodeHospitalCount[h.pincode] || 0) + 1;
    });

    const enrichedList = list.map((item) => ({
      ...item,
      hospitalCount: pincodeHospitalCount[item.pincode] || 0,
    }));

    res.status(200).json({
      success: true,
      data: enrichedList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search hospitals with pincode & area
// @route   GET /api/search/hospitals
// @access  Public
exports.searchHospitals = async (req, res, next) => {
  try {
    const { pincode, city, query } = req.query;
    const filter = { isActive: true };

    if (pincode) {
      filter.pincode = pincode.toString().trim();
    }
    if (city && city !== 'All') {
      filter.city = new RegExp(city, 'i');
    }
    if (query) {
      filter.$or = [
        { name: new RegExp(query, 'i') },
        { address: new RegExp(query, 'i') },
        { area: new RegExp(query, 'i') },
        { departments: new RegExp(query, 'i') },
      ];
    }

    const hospitals = await Hospital.find(filter).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error) {
    next(error);
  }
};
