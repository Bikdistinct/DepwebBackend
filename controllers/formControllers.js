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

exports.submitUserData = async (req, res) => {
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
