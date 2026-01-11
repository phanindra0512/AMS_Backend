const express = require("express");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const {
  createOwner,
  getOwners,
  updateOwner,
  getOwnerById,
  deleteOwner,
  assignTreasurer,
  getTreasurerByMonthYear,
} = require("../controllers/ownersController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Owners
 *   description: APIs for managing apartment owners
 */

/**
 * @swagger
 * /api/owners/createOwner:
 *   post:
 *     summary: Create a new owner
 *     tags: [Owners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *               - flatNumber
 *               - floorNumber
 *               - flatType
 *               - status
 *               - occupation
 *               - upiID
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Raju Kumar"
 *               phoneNumber:
 *                 type: string
 *                 example: "9949544127"
 *               flatNumber:
 *                 type: string
 *                 example: "A-202"
 *               floorNumber:
 *                 type: string
 *                 example: "1"
 *               flatType:
 *                 type: string
 *                 example: "2BHK"
 *               status:
 *                 type: string
 *                 enum: ["Owner", "Rented"]
 *                 example: "Owner"
 *               occupation:
 *                 type: string
 *                 example: "Software Engineer"
 *               upiID:
 *                 type: string
 *                 example: "raju@upi"
 *               familyDetails:
 *                 type: object
 *                 properties:
 *                   spouseName:
 *                     type: string
 *                     example: "Anita Kumar"
 *                   numberOfChildren:
 *                     type: number
 *                     example: 2
 *                   children:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Aryan Kumar"
 *     responses:
 *       201:
 *         description: Owner created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Owner created successfully"
 *               data:
 *                 _id: "6731b123a3d45d88a5c12345"
 *                 name: "Raju Kumar"
 *                 phoneNumber: "9949544127"
 *                 flatNumber: "A-202"
 *                 floorNumber: "1"
 *                 flatType: "2BHK"
 *                 status: "Owner"
 *                 occupation: "Software Engineer"
 *                 upiID: "raju@upi"
 *                 role: "resident"
 *                 familyDetails:
 *                   spouseName: "Anita Kumar"
 *                   numberOfChildren: 2
 *                   children:
 *                     - name: "Aryan Kumar"
 *                     - name: "Riya Kumar"
 *                 createdAt: "2025-10-24T11:49:43.603Z"
 *                 updatedAt: "2025-10-24T11:49:43.603Z"
 *       400:
 *         description: Phone number missing or duplicate
 *         content:
 *           application/json:
 *             example:
 *               error: "Phone number already exists"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/owners/getAllOwners:
 *   get:
 *     summary: Get all owners
 *     tags: [Owners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all owners
 *         content:
 *           application/json:
 *             example:
 *               - _id: "6731b123a3d45d88a5c12345"
 *                 name: "Raju Kumar"
 *                 phoneNumber: "9949544127"
 *                 flatNumber: "A-202"
 *                 floorNumber: "1"
 *                 flatType: "2BHK"
 *                 status: "Owner"
 *                 occupation: "Software Engineer"
 *                 upiID: "raju@upi"
 *                 role: "resident"
 *                 createdAt: "2025-10-24T11:49:43.603Z"
 *                 updatedAt: "2025-10-24T11:49:43.603Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */

/**
 * @swagger
 * /api/owners/getOwnerById/{id}:
 *   get:
 *     summary: Get a single owner by ID
 *     tags: [Owners]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Owner ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Owner details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "6731b123a3d45d88a5c12345"
 *               name: "Raju Kumar"
 *               phoneNumber: "9949544127"
 *               flatNumber: "A-202"
 *               floorNumber: "1"
 *               flatType: "2BHK"
 *               status: "Owner"
 *               occupation: "Software Engineer"
 *               upiID: "raju@upi"
 *               role: "resident"
 *               familyDetails:
 *                 spouseName: "Anita Kumar"
 *                 numberOfChildren: 2
 *                 children:
 *                   - name: "Aryan Kumar"
 *                   - name: "Riya Kumar"
 *               createdAt: "2025-10-24T11:49:43.603Z"
 *               updatedAt: "2025-10-24T11:49:43.603Z"
 *       404:
 *         description: Owner not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Owner not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */

/**
 * @swagger
 * /api/owners/updateOwner/{id}:
 *   put:
 *     summary: Update an existing owner's details
 *     tags: [Owners]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Owner ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Raju Kumar Updated"
 *               flatNumber:
 *                 type: string
 *                 example: "A-203"
 *               floorNumber:
 *                 type: string
 *                 example: "2"
 *               flatType:
 *                 type: string
 *                 example: "3BHK"
 *               status:
 *                 type: string
 *                 example: "Owner"
 *               occupation:
 *                 type: string
 *                 example: "Manager"
 *               upiID:
 *                 type: string
 *                 example: "rajuupdated@upi"
 *               familyDetails:
 *                 type: object
 *                 properties:
 *                   spouseName:
 *                     type: string
 *                     example: "Anita Kumar"
 *                   numberOfChildren:
 *                     type: number
 *                     example: 2
 *                   children:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Aryan Kumar"
 *     responses:
 *       200:
 *         description: Owner details updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Owner details updated successfully"
 *               data:
 *                 _id: "6731b123a3d45d88a5c12345"
 *                 name: "Raju Kumar Updated"
 *                 flatNumber: "A-203"
 *                 floorNumber: "2"
 *                 flatType: "3BHK"
 *                 status: "Owner"
 *                 occupation: "Manager"
 *                 upiID: "rajuupdated@upi"
 *                 role: "resident"
 *                 createdAt: "2025-10-24T11:49:43.603Z"
 *                 updatedAt: "2025-10-25T09:12:11.000Z"
 *       404:
 *         description: Owner not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Owner not found"
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             example:
 *               error: "Validation error message"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/owners/deleteOwner/{id}:
 *   delete:
 *     summary: Delete owner by ID (ADMIN)
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: Owner deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Owner deleted successfully"
 *       404:
 *         description: Owner not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Owner not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */

/**
 * @swagger
 * /api/owners/treasurer:
 *   get:
 *     summary: Get Treasurer Details by Month and Year
 *     description: Fetch the owner assigned as treasurer for a specific month and year.
 *     tags: [Owners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           example: 11
 *         description: The month number (1–12)
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: The year
 *     responses:
 *       200:
 *         description: Treasurer details fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Treasurer details for 11-2025
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 69089dbf656dd5cc0b84e0c6
 *                     name:
 *                       type: string
 *                       example: Raju Kumar
 *                     phoneNumber:
 *                       type: string
 *                       example: "9949544101"
 *                     flatNumber:
 *                       type: string
 *                       example: A-202
 *                     floorNumber:
 *                       type: string
 *                       example: "1"
 *                     flatType:
 *                       type: string
 *                       example: 2BHK
 *                     occupation:
 *                       type: string
 *                       example: Software Engineer
 *                     upiID:
 *                       type: string
 *                       example: raju@upi
 *                     role:
 *                       type: string
 *                       example: treasurer
 *       400:
 *         description: Missing or invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: month and year are required query parameters
 *       404:
 *         description: No treasurer found for the given month and year.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No treasurer assigned for 11-2025
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /api/owners/assign-treasurer:
 *   post:
 *     summary: Assign Treasurer for a Month and Year
 *     description: Assign an owner as treasurer for a given month and year.
 *     tags: [Owners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ownerId
 *               - month
 *               - year
 *             properties:
 *               ownerId:
 *                 type: string
 *                 example: 69089dbf656dd5cc0b84e0c6
 *               month:
 *                 type: integer
 *                 example: 11
 *               year:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       200:
 *         description: Treasurer assigned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Treasurer assigned successfully for 11-2025
 *       400:
 *         description: Missing or invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ownerId, month, and year are required fields
 *       404:
 *         description: Owner not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Owner not found
 *       409:
 *         description: Treasurer already assigned for the given month and year.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Treasurer already assigned for 11-2025
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

router.post("/createOwner", createOwner);
router.get("/getAllOwners", auth, getOwners);
router.get("/getOwnerById/:id", getOwnerById);
router.put("/updateOwner/:id", updateOwner);
router.delete("/deleteOwner/:id", deleteOwner);
router.get("/treasurer", auth, getTreasurerByMonthYear);
router.post("/assign-treasurer", auth, authorize("ADMIN"), assignTreasurer);

module.exports = router;
