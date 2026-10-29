// List of common passwords that have appeared in public internet breaches
// and trigger browser security popups (e.g. Google Chrome Password Manager)
const COMMON_BREACHED_PASSWORDS = new Set([
  '123456',
  'password',
  '12345678',
  'qwerty',
  '123456789',
  '12345',
  '1234',
  '111111',
  '1234567',
  'dragon',
  'welcome',
  'admin123',
  'patient123',
  'doctor123',
  'admin',
  'hospital123',
  'doctor',
  'patient',
  'user123',
  'secret',
  'pass123',
  'test123',
  'anupam123',
  'careconnect',
  'medical123',
  'hospital',
  'iloveyou',
  'abc123',
  'monkey',
  'letmein',
  'trustno1',
  'sunshine',
]);

/**
 * Validates whether a password meets security standards and is not in known breach lists
 * @param {string} password 
 * @returns {{ isValid: boolean, message: string }}
 */
const validatePasswordBreachStatus = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required.' };
  }

  const clean = password.trim().toLowerCase();
  if (COMMON_BREACHED_PASSWORDS.has(clean)) {
    return {
      isValid: false,
      message: 'This password has appeared in public internet data breaches and triggers browser security warnings. Please choose a stronger, unique password.',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long.',
    };
  }

  return { isValid: true };
};

module.exports = {
  COMMON_BREACHED_PASSWORDS,
  validatePasswordBreachStatus,
};
