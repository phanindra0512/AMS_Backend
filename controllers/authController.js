const Owners = require("../models/Owners");
const jwt = require("jsonwebtoken");

// Send OTP
const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: "phone number is required" });
    }

    // Check if phone number exists in Owners collection
    const owner = await Owners.findOne({ phoneNumber });
    if (!owner) {
      return res.status(404).json({ error: "Mobile number not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 mins

    // Save OTP in owner document
    owner.otp = otp;
    owner.otpExpires = otpExpires;
    await owner.save();

    // Return OTP (for testing, remove in production)
    res.json({
      success: true,
      message: "OTP generated successfully",
      otp,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    const owner = await Owners.findOne({ phoneNumber });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    if (owner.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (owner.otpExpires < Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // Clear OTP fields after successful verification
    owner.otp = null;
    owner.otpExpires = null;
    await owner.save();

    const token = jwt.sign(
    { id: owner._id, role: owner.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

    // Return owner info
    res.json({
      success: true,
      message: "OTP verified successfully",
      token,
      owner,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendOtp, verifyOtp };
