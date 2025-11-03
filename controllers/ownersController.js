const Owner = require("../models/Owners");

// ✅ Create a new owner
const createOwner = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // 1️⃣ Validate phone number
    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // 2️⃣ Check for duplicate phone number
    const existingOwner = await Owner.findOne({ phoneNumber });
    if (existingOwner) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    // 3️⃣ Prepare data (role defaults to resident)
    const ownerData = {
      ...req.body,
      role: req.body.role || "resident",
    };

    // 4️⃣ Create owner
    const owner = new Owner(ownerData);
    await owner.save();

    res.status(201).json({
      message: "Owner created successfully",
      data: owner,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all owners
const getOwners = async (req, res) => {
  try {
    const owners = await Owner.find();
    res.json(owners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get owner by ID
const getOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owner.findById(id);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }
    res.json(owner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOwner = async (req, res) => {
  try {
    const { id } = req.params;

    // Get existing owner
    const existingOwner = await Owner.findById(id);
    if (!existingOwner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // 🔒 Prevent phone number update
    const { phoneNumber, ...updateData } = req.body;

    // Update other allowed fields
    const updatedOwner = await Owner.findByIdAndUpdate(id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Validate before update
    });

    res.json({
      message: "Owner details updated successfully",
      data: updatedOwner,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete owner by ID
const deleteOwner = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if owner exists
    const owner = await Owner.findById(id);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Delete owner
    await Owner.findByIdAndDelete(id);

    res.json({ message: "Owner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createOwner,
  getOwners,
  getOwnerById,
  updateOwner,
  deleteOwner,
};
