// require("dotenv").config();

// const login = (req, res) => {
//   const { username, password } = req.body;
//   console.log(process.env.USERNAME);
//   // Check credentials from .env
//   if (username === process.env.USERN && password === process.env.PASSWORD) {
//     req.session.user = username; // Store in session
//     return res.json({ message: "Login successful" });
//   }

//   return res.status(401).json({ message: "Invalid username or password" });
// };

// const logout = (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).json({ message: "Logout failed" });
//     }
//     res.clearCookie("connect.sid"); // Remove session cookie
//     return res.json({ message: "Logged out successfully" });
//   });
// };

// // Middleware to check if user is logged in
// const isAuthenticated = (req, res, next) => {
//   if (req.session.user) {
//     return next();
//   }
//   return res.status(401).json({ message: "Not authenticated" });
// };

// module.exports = { login, logout, isAuthenticated };


require("dotenv").config();
const jwt = require("jsonwebtoken");

const login = (req, res) => {
  const { username, password } = req.body;

  // Check credentials from .env
  if (username === process.env.USERN && password === process.env.PASSWORD) {
    // Generate JWT token
    const token = jwt.sign(
      { username }, // payload
      process.env.JWT_SECRET, // secret
      { expiresIn: "1d" } // token expiry
    );

    return res.json({ message: "Login successful", token });
  }

  return res.status(401).json({ message: "Invalid username or password" });
};

const logout = (req, res) => {
  // With JWT, logout is handled on frontend by deleting token
  return res.json({ message: "Logout successful" });
};

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded; // attach user payload to request
    next();
  });
};

module.exports = { login, logout, isAuthenticated };
