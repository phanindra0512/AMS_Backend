const express = require("express");
const {
  createOwner,
  getOwners,
  updateOwner,
  getOwnerById,
} = require("../controllers/ownersController");
const router = express.Router();

router.post("/", createOwner); // POST /api/owners - Create new owner
router.get("/", getOwners); // GET /api/owners - Get all owners
router.put("/:id", updateOwner); // PUT /api/owners/:id  (update owner)
router.get("/:id", getOwnerById); // GET /api/owners/:id (get owner by ID)

module.exports = router;
