const express = require("express");
const router = express.Router();
const {
  setAdminFields,
  submitUserData,
  getCombinedData
} = require("../controllers/formControllers");

// Route to set form fields by admin
router.post("/admin/set-fields", setAdminFields);

// Route to submit form data by user
router.post("/user/submit", submitUserData);

router.post("/user/getData",getCombinedData);

module.exports = router;
