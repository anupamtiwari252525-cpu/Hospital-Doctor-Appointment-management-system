const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    const rawToken = req.headers.authorization.split(' ')[1];
    if (rawToken && rawToken !== 'null' && rawToken !== 'undefined' && rawToken.trim() !== '') {
      token = rawToken.trim();
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      code: 'AUTH_TOKEN_REQUIRED',
      message: 'Access denied: Authentication token required to access this resource.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'hospital_appointment_secret_jwt_key_2026_super_secure';
    const decoded = jwt.verify(token, secret);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_TOKEN_INVALID',
        message: 'Invalid authentication token payload.',
      });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'The user account associated with this token no longer exists.',
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_BLOCKED',
        message: 'Your account has been deactivated or restricted by an administrator.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'Your authentication session has expired. Please sign in again.',
      });
    }

    return res.status(401).json({
      success: false,
      code: 'TOKEN_INVALID',
      message: 'Authentication token is invalid or has been tampered with. Access denied.',
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_REQUIRED',
        message: 'Authentication required before verifying access privileges.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        code: 'FORBIDDEN_ROLE',
        message: `Forbidden: Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
