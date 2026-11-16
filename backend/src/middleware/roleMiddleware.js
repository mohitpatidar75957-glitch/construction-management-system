/**
 * SitePilot Role-Based Access Control (RBAC) Middleware
 * Restricts route access to specified roles (OWNER, PROJECT_MANAGER, SITE_ENGINEER, ACCOUNTANT)
 */
module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: No active session' });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Forbidden: Role '${req.user.role}' lacks permissions for this action` 
      });
    }

    next();
  };
};

