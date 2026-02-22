const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to registered owner
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP generated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OTP generated successfully"
 *               otp: "109737"
 *       400:
 *         description: Phone number required
 *         content:
 *           application/json:
 *             example:
 *               error: "phone number is required"
 *       404:
 *         description: Mobile number not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Mobile number not found"
 */

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for user login or signup
 *     description: Verifies the OTP sent to the user's phone number.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - otp
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "9949544127"
 *               otp:
 *                 type: string
 *                 example: "109737"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OTP verified successfully"
 *               owner:
 *                 familyDetails:
 *                   spouseName: "Anita Kumar"
 *                   numberOfChildren: 2
 *                   children:
 *                     - name: "Aryan Kumar"
 *                       _id: "68d42c125c2d73eac40b9f59"
 *                     - name: "Riya Kumar"
 *                       _id: "68d42c125c2d73eac40b9f5a"
 *                 _id: "68d42c125c2d73eac40b9f58"
 *                 name: "Raju Kumar"
 *                 phoneNumber: "9949544127"
 *                 flatNumber: "A-202"
 *                 floorNumber: "1"
 *                 flatType: "2BHK"
 *                 status: "Owner"
 *                 occupation: "Software Engineer"
 *                 upiID: "ravi@upi"
 *                 createdAt: "2025-09-24T17:36:18.359Z"
 *                 updatedAt: "2025-10-24T11:20:03.260Z"
 *                 __v: 0
 *                 otp: null
 *                 otpExpires: null
 *       400:
 *         description: Invalid OTP
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid OTP"
 */

// Routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
