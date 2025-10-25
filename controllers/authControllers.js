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


// require("dotenv").config();
// const jwt = require("jsonwebtoken");

// const login = (req, res) => {
//   const { username, password } = req.body;

//   // Check credentials from .env
//   if (username === process.env.USERN && password === process.env.PASSWORD) {
//     // Generate JWT token
//     const token = jwt.sign(
//       { username }, // payload
//       process.env.JWT_SECRET, // secret
//       { expiresIn: "1d" } // token expiry
//     );

//     return res.json({ message: "Login successful", token,username });
//   }

//   return res.status(401).json({ message: "Invalid username or password" });
// };

// const logout = (req, res) => {
//   // With JWT, logout is handled on frontend by deleting token
//   return res.json({ message: "Logout successful" });
// };

// // Middleware to check if user is authenticated
// const isAuthenticated = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Not authenticated" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });

//     req.user = decoded; // attach user payload to request
//     next();
//   });
// };

// module.exports = { login, logout, isAuthenticated };


// before 25 oct'25 not superadmin included
// require("dotenv").config();
// const jwt = require("jsonwebtoken");

// const login = (req, res) => {
//   const { username, password } = req.body;
//   let role = null;

//   // Check for admin
//   if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
//     role = "admin";
//   }
//   // Check for doctor
//   else if (username === process.env.DOCTOR_USER && password === process.env.DOCTOR_PASS) {
//     role = "doctor";
//   }

//   if (role) {
//     // Generate JWT with role included
//     const token = jwt.sign(
//       { username, role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return res.json({ message: "Login successful", role, token,username });
//   }

//   return res.status(401).json({ message: "Invalid username or password" });
// };

// const logout = (req, res) => {
//   // Frontend deletes token
//   return res.json({ message: "Logout successful" });
// };

// // Middleware to check if user is authenticated
// // const isAuthenticated = (req, res, next) => {
// //   const authHeader = req.headers["authorization"];
// //   const token = authHeader && authHeader.split(" ")[1];

// //   if (!token) {
// //     return res.status(401).json({ message: "Not authenticated" });
// //   }

// //   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
// //     if (err) return res.status(403).json({ message: "Invalid token" });

// //     req.user = decoded; // contains { username, role }
// //     next();
// //   });
// // };

// // // Middleware to check if user is authenticated
// const isAuthenticated = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Not authenticated" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });

//     req.user = decoded; // attach user payload to request
//     next();
//   });
// };


// // Middleware to restrict by role
// // const authorizeRoles = (...allowedRoles) => {
// //   return (req, res, next) => {
// //     if (!req.user || !allowedRoles.includes(req.user.role)) {
// //       return res.status(403).json({ message: "Access denied" });
// //     }
// //     next();
// //   };
// // };

// module.exports = { login, logout, isAuthenticated };


require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

// Utility functions to read/write credentials
const readCredentials = () => {
  const data = fs.readFileSync(CREDENTIALS_PATH, "utf-8");
  return JSON.parse(data);
};

const writeCredentials = (data) => {
  fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(data, null, 2), "utf-8");
};

// ✅ LOGIN
const login = async (req, res) => {
  const { username, password } = req.body;
  const credentials = readCredentials();

  // Find which role matches
  const userEntry = Object.entries(credentials).find(
    ([, user]) => user.username === username
  );

  if (!userEntry) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const [role, user] = userEntry;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res.json({ message: "Login successful", role, token, username });
};

// ✅ LOGOUT
const logout = (req, res) => {
  return res.json({ message: "Logout successful" });
};

// ✅ AUTH MIDDLEWARE
const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// ✅ ROLE-BASED ACCESS
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

// ✅ SUPERADMIN CHANGE PASSWORD
const changeUserPassword = async (req, res) => {
  const { targetRole, newPassword } = req.body;

  if (!targetRole || !newPassword) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const credentials = readCredentials();

  // Only superadmin can modify
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied" });
  }

  if (!credentials[targetRole]) {
    return res.status(404).json({ message: "Target role not found" });
  }

  // Hash and update
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  credentials[targetRole].password = hashedPassword;

  writeCredentials(credentials);

  return res.json({ message: `${targetRole}'s password updated successfully` });
};

module.exports = {
  login,
  logout,
  isAuthenticated,
  authorizeRoles,
  changeUserPassword,
};
