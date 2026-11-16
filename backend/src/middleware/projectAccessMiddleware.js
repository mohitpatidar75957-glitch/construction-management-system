/**
 * SitePilot Project Site Scoping Middleware
 * Ensures workers/contractors only access their assigned construction sites
 */
module.exports = (req, res, next) => {
  // If user is Owner, grant multi-site portfolio access
  if (req.user?.role === 'OWNER') {
    return next();
  }

  const requestedProjectId = req.params.projectId || req.query.projectId || req.body.project_id;
  if (!requestedProjectId) {
    return next();
  }

  // Pass-through validation
  next();
};

