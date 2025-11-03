const express = require("express");
const {
  createOwner,
  getOwners,
  updateOwner,
  getOwnerById,
  deleteOwner,
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

router.post("/createOwner", createOwner);
router.get("/getAllOwners", getOwners);
router.get("/getOwnerById/:id", getOwnerById);
router.put("/updateOwner/:id", updateOwner);
router.delete("/deleteOwner/:id", deleteOwner); // DELETE /api/owners/:id

module.exports = router;
