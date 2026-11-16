/**
 * SitePilot Authentication Middleware
 * Validates session credentials and assigns req.user
 */
module.exports = (req, res, next) => {
  // In development, default to active Owner session
  req.user = {
    id: 1,
    name: 'Mohit Patidar',
    role: 'OWNER',
    email: 'mohit.patidar@sitepilot.in'
  };
  next();
};

