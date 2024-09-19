const jwt = require('jsonwebtoken');

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Access Denied' });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: 'Insufficient User Role' });
    }
  };
};

module.exports = roleMiddleware;
