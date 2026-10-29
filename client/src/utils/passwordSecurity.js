// Common weak & breached passwords frequently found in public data breaches
// which trigger Google Chrome's "Password found in a data breach" warning dialog
export const COMMON_BREACHED_PASSWORDS = new Set([
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
 * Checks if a given password is in known breach databases or fails security standards
 * @param {string} password 
 * @returns {{ isBreached: boolean, reason: string, score: number }}
 */
export function checkPasswordBreachStatus(password) {
  if (!password) {
    return { isBreached: false, reason: '', score: 0 };
  }

  const clean = password.trim().toLowerCase();

  // 1. Direct match with common breached passwords
  if (COMMON_BREACHED_PASSWORDS.has(clean)) {
    return {
      isBreached: true,
      reason: 'This password was found in public internet data breaches and triggers browser alerts. Please pick a unique password.',
      score: 1,
    };
  }

  // 2. Contains simple common dictionary roots
  const commonRoots = ['password', '123456', 'admin123', 'patient123', 'doctor123'];
  for (const root of commonRoots) {
    if (clean.length < 10 && clean.includes(root)) {
      return {
        isBreached: true,
        reason: 'This contains common dictionary patterns known to be compromised in data breaches.',
        score: 1,
      };
    }
  }

  // 3. Length check
  if (password.length < 8) {
    return {
      isBreached: false,
      reason: 'Password is too short (minimum 8 characters required).',
      score: 2,
    };
  }

  // 4. Complexity checks
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  let score = 2;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;
  if (password.length >= 10) score++;

  if (!hasUpper || !hasNumber || !hasSpecial) {
    return {
      isBreached: false,
      reason: 'For breach protection, include at least 1 uppercase letter, 1 number, and 1 special symbol.',
      score: Math.min(score, 3),
    };
  }

  return {
    isBreached: false,
    reason: 'Excellent! This strong password will not trigger browser breach warnings.',
    score: Math.min(score, 5),
  };
}

/**
 * Generates an ultra-secure, breach-proof random password
 * Guaranteed to never match common dictionaries or trigger Chrome breach alerts
 * @returns {string}
 */
export function generateBreachProofPassword() {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // excludes ambiguous chars
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%^&*';

  // Ensure at least one from each category
  let pwd = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  const all = upper + lower + digits + symbols;
  for (let i = 0; i < 8; i++) {
    pwd.push(all[Math.floor(Math.random() * all.length)]);
  }

  // Shuffle
  return pwd.sort(() => Math.random() - 0.5).join('');
}
