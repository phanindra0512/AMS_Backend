const express = require("express");
const router = express.Router();

const {
  payMaintenance,
  getPaymentsByMonthYear,
  getPaymentsByOwnerId,
  paymentApproval,
  getTreasurerAmount,
} = require("../controllers/maintenanceController");
const authorize = require("../middlewares/authorize");

const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Maintenance
 *   description: Maintenance payment related APIs
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
 *         example: 4
 *         description: Month number (1-12)
 *
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2026
 *         description: Year
 *
 *     responses:
 *       200:
 *         description: Payments fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               month: 4
 *               year: 2026
 *               totalPayments: 2
 *               totalAmount: 2000
 *               expensesAmount: 800
 *               balanceAmount: 1200
 *               data:
 *                 - _id: "69e3df1ad606f589ac23033f"
 *                   transactionId: "123456789011"
 *                   ownerId: "69c8e1b4d7113107cc7bea55"
 *                   month: 4
 *                   year: 2026
 *                   flatNumber: "G1"
 *                   ownerName: "Raja Rao"
 *                   ownerMobile: "7337468903"
 *                   amount: 1000
 *                   paymentType: "UPI"
 *                   paymentStatus: "APPROVED"
 *                   receiptUrl: "https://res.cloudinary.com/example.jpg"
 *                   createdAt: "2026-04-18T19:44:26.771Z"
 *                   updatedAt: "2026-04-18T19:46:46.155Z"
 *                   treasurer:
 *                     treasurerId: "69b5907ae47d27e70fec34c2"
 *                     treasurerName: "Raju Kumar"
 *                     treasurerPhoneNumber: "9949544127"
 *                     treasurerUpiID: "raju@upi"
 *
 *       400:
 *         description: Month and year are required
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Month and year are required"
 *
 *       403:
 *         description: Only ADMIN or TREASURER can access
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Access denied"
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal server error"
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

/**
 * @swagger
 * /api/maintenance/approval:
 *   post:
 *     summary: Approve or reject a pending payment (Treasurer only)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []   # JWT token required, user must be TREASURER
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *               - status
 *             properties:
 *               paymentId:
 *                 type: string
 *                 description: MongoDB ObjectId of the payment to approve/reject
 *                 example: "66a91e123abc456def789xyz"
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *                 description: Status to update the payment to
 *                 example: "APPROVED"
 *
 *     responses:
 *       200:
 *         description: Payment approved or rejected successfully
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
 *                   example: "Payment approved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "66a91e123abc456def789xyz"
 *                     transactionId:
 *                       type: string
 *                       example: "458923741256"
 *                     ownerId:
 *                       type: string
 *                       example: "65f0ab1234"
 *                     flatNumber:
 *                       type: string
 *                       example: "201"
 *                     ownerName:
 *                       type: string
 *                       example: "Phani"
 *                     amount:
 *                       type: number
 *                       example: 1000
 *                     paymentStatus:
 *                       type: string
 *                       example: "APPROVED"
 *                     month:
 *                       type: integer
 *                       example: 6
 *                     year:
 *                       type: integer
 *                       example: 2025
 *                     receiptUrl:
 *                       type: string
 *                       example: "/uploads/receipts/1768033926076.png"
 *                     treasurer:
 *                       type: object
 *                       properties:
 *                         treasurerId:
 *                           type: string
 *                         treasurerName:
 *                           type: string
 *                         treasurerPhoneNumber:
 *                           type: string
 *                         treasurerUpiID:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *
 *       400:
 *         description: Invalid request or payment already processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Status must be either APPROVED or REJECTED"
 *
 *       403:
 *         description: Forbidden - User is not TREASURER or not the assigned treasurer for this payment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You are not the assigned treasurer for this payment"
 *
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Payment not found"
 *
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/maintenance/treasurer-amount:
 *   get:
 *     summary: Get overall treasurer balance amount
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Treasurer amount fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               totalCollection: 50000
 *               totalExpenses: 15000
 *               treasurerAmount: 35000
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid token
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

router.post("/pay", auth, upload.single("receipt"), payMaintenance);
router.get("/payments", auth, getPaymentsByMonthYear);
router.get("/owners/:ownerId/payments", auth, getPaymentsByOwnerId);
router.post("/approval", auth, authorize("TREASURER"), paymentApproval);
router.get("/treasurer-amount", auth, getTreasurerAmount);

module.exports = router;
