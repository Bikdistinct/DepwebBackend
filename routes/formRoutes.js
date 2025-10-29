const express = require("express");
const router = express.Router();
const {
  setAdminFields,
  submitUserData,
  getCombinedData,
  editUserData,
} = require("../controllers/formControllers");

const { isAuthenticated } = require("../controllers/authControllers");

// Route to set form fields by admin
router.post("/admin/set-fields", setAdminFields);

// Route to submit form data by user
router.post("/user/submit", isAuthenticated, submitUserData);

router.post("/user/edit", isAuthenticated, editUserData);

router.post("/user/getData", isAuthenticated, getCombinedData);

module.exports = router;
