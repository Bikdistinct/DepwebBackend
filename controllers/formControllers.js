const axios = require("axios");
require("dotenv").config();

const GAS_WEB_APP_URL = process.env.GAS_WEB_APP_URL;

exports.setAdminFields = async (req, res) => {
  try {
    const { fields } = req.body;

    const response = await axios.post(GAS_WEB_APP_URL, {
      type: "admin_set_fields",
      fields,
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};

// exports.submitUserData = async (req, res) => {
//   try {
//     const { values } = req.body;

//     const response = await axios.post(GAS_WEB_APP_URL, {
//       type: "user_submit",
//       values,
//     });

//     res.json({ success: true, data: response.data });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.response?.data || error.message,
//     });
//   }
// };

exports.submitUserData = async (req, res) => {
  try {
    const { values } = req.body;

    // ✅ Extract MED1_1 (unique field)
    const uniqueId = values["MED1_1"] || values.MED1_1;
    console.log("uniqueId", uniqueId);
    if (!uniqueId) {
      return res.status(400).json({
        success: false,
        message: "Missing unique field MED1_1",
      });
    }

    // ✅ Step 1: Fetch existing records
    const existingDataResponse = await axios.post(GAS_WEB_APP_URL, {
      type: "get_combined_data",
    });

    const existingData = existingDataResponse.data.data || [];
    console.log("existing raw", existingData);
    // ✅ Step 2: Check if MED1_1 already exists
    const alreadyExists = existingData.some(
      (entry) => entry.MED1_1 === uniqueId
    );
    console.log("already exist", alreadyExists);
    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        message: `Form with Hospital No. "${uniqueId}" already exists.`,
      });
    }

    // ✅ Step 3: Submit new form
    const response = await axios.post(GAS_WEB_APP_URL, {
      type: "user_submit",
      values,
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};

exports.editUserData = async (req, res) => {
  try {
    const { values } = req.body;

    const response = await axios.post(GAS_WEB_APP_URL, {
      type: "user_submit",
      values,
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};

exports.getCombinedData = async (req, res) => {
  try {
    const response = await axios.post(GAS_WEB_APP_URL, {
      type: "get_combined_data",
    });

    console.log(response.data.data);
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};
