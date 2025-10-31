const express = require("express");
const {
  createOwner,
  getOwners,
  updateOwner,
  getOwnerById,
} = require("../controllers/ownersController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Owners
 *   description: Owner management endpoints
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
 *               name: "Raju Kumar"
 *               phoneNumber: "9949544127"
 *               flatNumber: "A-202"
 *               floorNumber: "1"
 *               flatType: "2BHK"
 *               status: "Owner"
 *               occupation: "Software Engineer"
 *               upiID: "raju@upi"
 *               familyDetails:
 *                 spouseName: "Anita Kumar"
 *                 numberOfChildren: 2
 *                 children:
 *                   - name: "Aryan Kumar"
 *                     _id: "68fb67d768e91f30950cd46e"
 *                   - name: "Riya Kumar"
 *                     _id: "68fb67d768e91f30950cd46f"
 *               _id: "68fb67d768e91f30950cd46d"
 *               createdAt: "2025-10-24T11:49:43.603Z"
 *               updatedAt: "2025-10-24T11:49:43.603Z"
 *               __v: 0
 *       400:
 *         description: Validation or bad request
 *         content:
 *           application/json:
 *             example:
 *               error: "Validation error message"
 */

/**
 * @swagger
 * /api/owners/getAllOwners:
 *   get:
 *     summary: Get all owners
 *     tags: [Owners]
 *     responses:
 *       200:
 *         description: List of all owners
 *         content:
 *           application/json:
 *             example:
 *               - familyDetails:
 *                   spouseName: "Anita Kumar"
 *                   numberOfChildren: 2
 *                   children:
 *                     - name: "Aryan Kumar"
 *                       _id: "68d4283f42cb55a555f7765b"
 *                     - name: "Riya Kumar"
 *                       _id: "68d4283f42cb55a555f7765c"
 *                 _id: "68d4283f42cb55a555f7765a"
 *                 name: "Phani Kumar"
 *                 phoneNumber: "9876543210"
 *                 flatNumber: "A-102"
 *                 floorNumber: "1"
 *                 flatType: "2BHK"
 *                 status: "Owner"
 *                 occupation: "Software Engineer"
 *                 upiID: "ravi@upi"
 *                 createdAt: "2025-09-24T17:19:59.691Z"
 *                 updatedAt: "2025-09-24T17:31:06.213Z"
 *                 __v: 0
 *               - familyDetails:
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal server error"
 */

/**
 * @swagger
 * /api/owners/getOwnerById/{id}:
 *   get:
 *     summary: Get owner by ID
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
 *         description: Owner found
 *         content:
 *           application/json:
 *             example:
 *               name: "Raju Kumar"
 *               phoneNumber: "9949544127"
 *               flatNumber: "A-202"
 *               floorNumber: "1"
 *               flatType: "2BHK"
 *               status: "Owner"
 *               occupation: "Software Engineer"
 *               upiID: "raju@upi"
 *               familyDetails:
 *                 spouseName: "Anita Kumar"
 *                 numberOfChildren: 2
 *                 children:
 *                   - name: "Aryan Kumar"
 *                     _id: "68fb67d768e91f30950cd46e"
 *                   - name: "Riya Kumar"
 *                     _id: "68fb67d768e91f30950cd46f"
 *               _id: "68fb67d768e91f30950cd46d"
 *               createdAt: "2025-10-24T11:49:43.603Z"
 *               updatedAt: "2025-10-24T11:49:43.603Z"
 *               __v: 0
 *       404:
 *         description: Owner not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Owner not found"
 */

/**
 * @swagger
 * /api/owners/updateOwner/{id}:
 *   put:
 *     summary: Update owner details
 *     tags: [Owners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Owner ID
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
 *       200:
 *         description: Owner updated successfully
 *         content:
 *           application/json:
 *             example:
 *               name: "Raju Kumar Updated"
 *               phoneNumber: "9949544127"
 *               flatNumber: "A-202"
 *               floorNumber: "1"
 *               flatType: "2BHK"
 *               status: "Owner"
 *               occupation: "Software Engineer"
 *               upiID: "raju@upi"
 *               familyDetails:
 *                 spouseName: "Anita Kumar"
 *                 numberOfChildren: 2
 *                 children:
 *                   - name: "Aryan Kumar"
 *                     _id: "68fb67d768e91f30950cd46e"
 *                   - name: "Riya Kumar"
 *                     _id: "68fb67d768e91f30950cd46f"
 *               _id: "68fb67d768e91f30950cd46d"
 *               createdAt: "2025-10-24T11:49:43.603Z"
 *               updatedAt: "2025-10-24T12:10:00.000Z"
 *               __v: 0
 *       404:
 *         description: Owner not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Owner not found"
 *       400:
 *         description: Validation error / bad request
 *         content:
 *           application/json:
 *             example:
 *               error: "Validation error message"
 */


router.post("/createOwner", createOwner); // POST /api/owners - Create new owner
router.get("/getAllOwners", getOwners); // GET /api/owners - Get all owners
router.put("/updateOwner/:id", updateOwner); // PUT /api/owners/:id  (update owner)
router.get("/getOwnerById/:id", getOwnerById); // GET /api/owners/:id (get owner by ID)

module.exports = router;
