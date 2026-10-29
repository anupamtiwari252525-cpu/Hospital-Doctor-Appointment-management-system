const { sendPasswordResetEmail } = require('./emailService');
const { sendNotification } = require('./notificationHelper');
const {
  PINCODE_DATABASE,
  getPincodeInfo,
  calculateDistance,
  getNearbyPincodes,
  searchPincodes,
} = require('./pincodeHelper');
const { generateTimeSlots } = require('./slotGenerator');
const { validatePasswordBreachStatus, COMMON_BREACHED_PASSWORDS } = require('./passwordSecurity');

module.exports = {
  sendPasswordResetEmail,
  sendNotification,
  PINCODE_DATABASE,
  getPincodeInfo,
  calculateDistance,
  getNearbyPincodes,
  searchPincodes,
  generateTimeSlots,
  validatePasswordBreachStatus,
  COMMON_BREACHED_PASSWORDS,
};

