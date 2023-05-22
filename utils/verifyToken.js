const jwt = require('jsonwebtoken');
const { createError } = require('../utils/error');
const User = require('../Models/UserModel');

const verifyToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);

    const userId = decodedToken.userId;

    req.userId = userId; // Set the userId in the request object for later use

    next();
  } catch (err) {
    next(err);
  }
};

const verifyJobSeekerToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);

    const userId = decodedToken.userId;
    const userRole = decodedToken.role;

    if (userRole !== 'jobSeeker') {
      return res.status(401).json({ error: 'Not authorized' });
    }

    req.userId = userId; // Set the userId in the request object for later use

    next();
  } catch (err) {
    next(err);
  }
};
// provider token
const verifyJobProviderToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);

    const userId = decodedToken.userId;
    const userRole = decodedToken.role;

    if (userRole !== 'jobProvider') {
      return res.status(401).json({ error: 'Not authorized' });
    }

    req.userId = userId; // Set the userId in the request object for later use

    next();
  } catch (err) {
    next(err);
  }
};
// Admin token
const verifyAdminToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);

    const userId = decodedToken.userId;
    const userRole = decodedToken.role;

    if (userRole !== 'jobProvider') {
      return res.status(401).json({ error: 'Not authorized' });
    }

    req.userId = userId; // Set the userId in the request object for later use

    next();
  } catch (err) {
    next(err);
  }
};



module.exports = {
  verifyToken,
  verifyJobSeekerToken,
  verifyJobProviderToken,
  verifyAdminToken
};
