  const jwt = require("jsonwebtoken");

  module.exports = (req, res, next) => {
    try {
      // Check if the Authorization header is present and properly formatted
      const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).send({
          message: "Auth failed: No token provided",
          success: false,
        });
      }

      // Verify the token and decode it
      const decoded = jwt.verify(token, process.env.jwt_secret);

      // Store the decoded user ID in req.user for consistency
      req.user = { id: decoded.userId }; // Assuming your token contains userId

      // Continue with the request
      next();
    } catch (error) {
      return res.status(401).send({
        message: "Auth failed: Invalid token",
        success: false,
      });
    }
  };
