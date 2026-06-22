const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const upload = require("../middlewares/upload");

const {
  addExpense,
  getExpensesByMonthYear,
} = require("../controllers/expenseController");

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense Management APIs
 */

/**
 * @swagger
 * /api/expenses/addExpense:
 *   post:
 *     summary: Add a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - serviceType
 *               - serviceProviderName
 *               - contactNumber
 *               - amountPaid
 *             properties:
 *               serviceType:
 *                 type: string
 *                 enum:
 *                   - PLUMBER
 *                   - ELECTRICIAN
 *                   - CARPENTER
 *                   - MUNICIPALITY
 *                   - OTHER
 *                 example: OTHER
 *
 *               customServiceType:
 *                 type: string
 *                 example: PAINTER
 *                 description: Required only when serviceType is OTHER
 *
 *               serviceProviderName:
 *                 type: string
 *                 example: Ramesh
 *
 *               contactNumber:
 *                 type: string
 *                 example: "9876543210"
 *
 *               amountPaid:
 *                 type: number
 *                 example: 2500
 *
 *               image:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       201:
 *         description: Expense added successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Expense added successfully
 *
 *       400:
 *         description: Validation error
 *
 *       403:
 *         description: Access denied
 *
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/expenses/getAllExpenseByMonthYear:
 *   get:
 *     summary: Get expenses by month and year
 *     tags: [Expenses]
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
 *           example: 2026
 *     responses:
 *       200:
 *         description: Expenses fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               month: 6
 *               year: 2026
 *               totalExpenses: 2
 *               totalExpenseAmount: 5000
 *       400:
 *         description: Month and year are required
 *       500:
 *         description: Server error
 */
router.post(
  "/addExpense",
  auth,
  authorize("ADMIN", "TREASURER"),
  upload.single("image"),
  addExpense,
);

router.get("/getAllExpenseByMonthYear", auth, getExpensesByMonthYear);

module.exports = router;
