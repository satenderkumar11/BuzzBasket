const jwt = require("jsonwebtoken");

exports.verifyByToken = async (req, res, next) => {
  try {
    // Extract the token from cookies
    const token = req.cookies.token;

    // Check if token is provided
    if (!token) {
      return res.status(204).json({
        status: 'error',
        message: 'No token provided'
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to request object
    req.user = decoded;

    // Call the next middleware
    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }

    // Handle other errors
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: err.message
    });
  }
};
