// routes/maintenanceRoutes.js
const express = require("express");
const router = express.Router();

const {
  payMaintenance,
  getPaymentsByMonthYear,
} = require("../controllers/maintenanceController");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * tags:
 *   name: Maintenance
 *   description: Maintenance payment APIs
 */

/**
 * @swagger
 * /api/maintenance/pay:
 *   post:
 *     summary: Pay maintenance with receipt upload
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - year
 *               - flatNumber
 *               - ownerName
 *               - ownerMobile
 *               - amount
 *               - transactionId
 *               - paymentType
 *             properties:
 *               transactionId:
 *                 type: string
 *                 example: "458923741256"
 *                 description: 12-digit UPI transaction ID
 *               month:
 *                 type: integer
 *                 example: 6
 *               year:
 *                 type: integer
 *                 example: 2025
 *               flatNumber:
 *                 type: string
 *                 example: "201"
 *               ownerName:
 *                 type: string
 *                 example: "Phani"
 *               ownerMobile:
 *                 type: string
 *                 example: "9505876290"
 *               amount:
 *                 type: number
 *                 example: 1000
 *               paymentType:
 *                 type: string
 *                 enum: [UPI, Cash, Bank Transfer]
 *                 example: UPI
 *               receipt:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Maintenance payment successful
 *       400:
 *         description: Treasurer not assigned
 *       409:
 *         description: Maintenance already paid
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/maintenance/payments:
 *   get:
 *     summary: Get maintenance payments by month and year
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           example: 6
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2025
 *     responses:
 *       200:
 *         description: List of maintenance payments
 *         content:
 *           application/json:
 *             example:
 *               - flatNumber: "201"
 *                 ownerName: "Phani"
 *                 amount: 1000
 *                 paymentType: "UPI"
 *                 receiptUrl: "/uploads/receipts/1768033926076.png"
 *                 treasurer:
 *                   name: "Raju"
 *                   phoneNumber: "9949544127"
 *                   upiID: "raju@upi"
 *       400:
 *         description: Missing query params
 *       500:
 *         description: Server error
 */

router.post("/pay", auth, upload.single("receipt"), payMaintenance);
router.get("/payments", auth, getPaymentsByMonthYear);

module.exports = router;
