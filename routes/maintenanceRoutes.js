// routes/maintenanceRoutes.js

const express = require("express");
const router = express.Router();

const {
  payMaintenance,
  getPaymentsByMonthYear,
  getPaymentsByOwnerId,
} = require("../controllers/maintenanceController");
const authorize = require("../middlewares/authorize");

const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");

/**
 * ============================================
 *              SWAGGER TAG
 * ============================================
 */

/**
 * @swagger
 * tags:
 *   name: Maintenance
 *   description: Maintenance payment related APIs
 */

/**
 * ============================================
 *          PAY MAINTENANCE API
 * ============================================
 */

/**
 * @swagger
 * /api/maintenance/pay:
 *   post:
 *     summary: Pay monthly maintenance with optional receipt upload
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *               - month
 *               - year
 *               - flatNumber
 *               - ownerName
 *               - ownerMobile
 *               - amount
 *               - paymentType
 *             properties:
 *               transactionId:
 *                 type: string
 *                 pattern: "^[0-9]{12}$"
 *                 example: "458923741256"
 *                 description: Must be exactly 12 digits
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
 *                 enum: [UPI, CASH, BANK TRANSFER]
 *                 example: UPI
 *               receipt:
 *                 type: string
 *                 format: binary
 *                 description: Optional receipt image upload
 *
 *     responses:
 *       201:
 *         description: Maintenance payment successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Maintenance payment successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "66a91e123abc"
 *                     transactionId:
 *                       type: string
 *                       example: "458923741256"
 *                     ownerId:
 *                       type: string
 *                       example: "65f0ab1234"
 *                     month:
 *                       type: integer
 *                       example: 6
 *                     year:
 *                       type: integer
 *                       example: 2025
 *                     flatNumber:
 *                       type: string
 *                       example: "201"
 *                     ownerName:
 *                       type: string
 *                       example: "Phani"
 *                     ownerMobile:
 *                       type: string
 *                       example: "9505876290"
 *                     amount:
 *                       type: number
 *                       example: 1000
 *                     paymentType:
 *                       type: string
 *                       example: "UPI"
 *                     paymentStatus:
 *                       type: string
 *                       example: "PENDING"
 *                     receiptUrl:
 *                       type: string
 *                       example: "/uploads/receipts/1768033926076.png"
 *
 *       400:
 *         description: Invalid request data
 *
 *       404:
 *         description: Owner or Treasurer not found
 *
 *       409:
 *         description: Duplicate transaction or maintenance already paid
 *
 *       500:
 *         description: Server error
 */

/**
 * ============================================
 *        GET PAYMENTS BY MONTH/YEAR
 * ============================================
 */

/**
 * @swagger
 * /api/maintenance/payments:
 *   get:
 *     summary: Get all maintenance payments by month and year
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
 *
 *     responses:
 *       200:
 *         description: List of maintenance payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 month:
 *                   type: integer
 *                   example: 6
 *                 year:
 *                   type: integer
 *                   example: 2025
 *                 totalPayments:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       flatNumber:
 *                         type: string
 *                         example: "201"
 *                       ownerName:
 *                         type: string
 *                         example: "Phani"
 *                       amount:
 *                         type: number
 *                         example: 1000
 *                       paymentType:
 *                         type: string
 *                         example: "UPI"
 *                       paymentStatus:
 *                         type: string
 *                         example: "PENDING"
 *
 *       400:
 *         description: Month and year required
 *
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/maintenance/owners/{ownerId}/payments:
 *   get:
 *     summary: Get all payments of a particular owner (Admin & Treasurer only)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         example: "69631ad7321a3ac0e1a77bbc"
 *     responses:
 *       200:
 *         description: Owner payments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 ownerId:
 *                   type: string
 *                   example: "69631ad7321a3ac0e1a77bbc"
 *                 totalPayments:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "699aca98fe2743ada5203cb5"
 *                       transactionId:
 *                         type: string
 *                         example: "123456789013"
 *                       ownerId:
 *                         type: string
 *                         example: "69631ad7321a3ac0e1a77bbc"
 *                       month:
 *                         type: integer
 *                         example: 2
 *                       year:
 *                         type: integer
 *                         example: 2026
 *                       flatNumber:
 *                         type: string
 *                         example: "401"
 *                       ownerName:
 *                         type: string
 *                         example: "Phanindra Nani"
 *                       ownerMobile:
 *                         type: string
 *                         example: "9505876200"
 *                       amount:
 *                         type: number
 *                         example: 1000
 *                       paymentType:
 *                         type: string
 *                         example: "UPI"
 *                       paymentStatus:
 *                         type: string
 *                         example: "PENDING"
 *                       receiptUrl:
 *                         type: string
 *                         example: "/uploads/receipts/1771752088707-996609288.png"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-02-22T09:21:28.990Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-02-22T09:21:28.990Z"
 *                       __v:
 *                         type: integer
 *                         example: 0
 *                       treasurer:
 *                         type: object
 *                         properties:
 *                           treasurerId:
 *                             type: string
 *                             example: "69631ad7321a3ac0e1a77bbc"
 *                           treasurerName:
 *                             type: string
 *                             example: "Phanindra Nani"
 *                           treasurerPhoneNumber:
 *                             type: string
 *                             example: "9505876290"
 *                           treasurerUpiID:
 *                             type: string
 *                             example: "phanindra@upi"
 *
 *       400:
 *         description: Owner ID required
 *
 *       403:
 *         description: Forbidden (Only ADMIN or TREASURER allowed)
 *
 *       404:
 *         description: Owner not found
 *
 *       500:
 *         description: Server error
 */

// Routes
router.post("/pay", auth, upload.single("receipt"), payMaintenance);
router.get("/payments", auth, getPaymentsByMonthYear);
router.get(
  "/owners/:ownerId/payments",
  auth,
  authorize("ADMIN", "TREASURER"),
  getPaymentsByOwnerId,
);

module.exports = router;
