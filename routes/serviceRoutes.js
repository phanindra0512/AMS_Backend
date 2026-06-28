const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

const {
  createService,
  getAllServices,
} = require("../controllers/serviceController");

/**
 * @swagger
 * /api/services/create:
 *   post:
 *     summary: Create a new service provider
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceType
 *               - serviceProviderName
 *               - mobileNumber
 *               - location
 *             properties:
 *               serviceType:
 *                 type: string
 *                 enum:
 *                   - PLUMBER
 *                   - ELECTRICIAN
 *                   - CARPENTER
 *                   - MUNICIPALITY
 *                   - OTHER
 *                 example: PLUMBER
 *
 *               customServiceType:
 *                 type: string
 *                 nullable: true
 *                 description: Required only when serviceType is OTHER
 *                 example: PAINTER
 *
 *               serviceProviderName:
 *                 type: string
 *                 example: Ramesh
 *
 *               mobileNumber:
 *                 type: string
 *                 example: "9876543210"
 *
 *               location:
 *                 type: string
 *                 example: Miyapur, Hyderabad
 *
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Service created successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "686bf8f47f3b6e57d29f0011"
 *
 *                     serviceType:
 *                       type: string
 *                       example: PLUMBER
 *
 *                     customServiceType:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *
 *                     serviceProviderName:
 *                       type: string
 *                       example: Ramesh
 *
 *                     mobileNumber:
 *                       type: string
 *                       example: "9876543210"
 *
 *                     location:
 *                       type: string
 *                       example: Miyapur, Hyderabad
 *
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-28T12:30:10.000Z"
 *
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-28T12:30:10.000Z"
 *
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: All fields are required
 *
 *       409:
 *         description: Service provider already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Service provider already exists.
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /api/services/getAllServices:
 *   get:
 *     summary: Get all service providers
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Services fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 totalServices:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "686bf8f47f3b6e57d29f0011"
 *                       serviceType:
 *                         type: string
 *                         example: PLUMBER
 *                       customServiceType:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       serviceProviderName:
 *                         type: string
 *                         example: Ramesh
 *                       mobileNumber:
 *                         type: string
 *                         example: "9876543210"
 *                       location:
 *                         type: string
 *                         example: Miyapur
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server error
 */

router.post("/create", auth, authorize("ADMIN", "TREASURER"), createService);

router.get("/getAllServices", auth, getAllServices);

module.exports = router;
