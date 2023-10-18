const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
    // Get the token from the Authorization header
    const authToken = req.headers.authorization;
    const token = authToken && authToken.split(' ')[1];
  
    // Check if a token exists
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    // Verify the token
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
  
      // Token is valid, attach the decoded payload to the request object
      req.user = decoded;
  
      // Continue to the next middleware or route handler
      next();
    });
  }
  
function verifyAdmin(req, res, next) {
  // Check if the user has the admin's role
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  next();
}

function verifyUser(req, res, next) {
  // Check if the user has the user's role
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  next();
}

module.exports = { verifyToken, verifyAdmin, verifyUser };
