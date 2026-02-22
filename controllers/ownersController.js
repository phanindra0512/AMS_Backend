const Owner = require("../models/Owners");
const TreasurerAssignment = require("../models/TreasurerAssignment");

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
      role: req.body.role ? req.body.role.toUpperCase() : "RESIDENT",
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

    const { phoneNumber, role, ...rest } = req.body;

    const updateData = {
      ...rest,

      // ✅ FIX: normalize role if provided
      ...(role && { role: role.toUpperCase() }),
    };

    const updatedOwner = await Owner.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
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

// ✅ Assign treasurer to a particular owner
const assignTreasurer = async (req, res) => {
  try {
    const { ownerId, month, year } = req.body;

    if (!ownerId || !month || !year) {
      return res
        .status(400)
        .json({ error: "ownerId, month, and year are required" });
    }

    const existing = await TreasurerAssignment.findOne({ month, year });
    if (existing) {
      return res.status(400).json({
        error: `A treasurer is already assigned for ${month}-${year}`,
      });
    }

    // 1️⃣ Revert any existing treasurer to 'resident'
    await Owner.updateMany({ role: "TREASURER" }, { role: "RESIDENT" });

    // 2️⃣ Assign new treasurer
    const updatedOwner = await Owner.findByIdAndUpdate(
      ownerId,
      { role: "TREASURER" },
      { new: true },
    );

    if (!updatedOwner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // 3️⃣ Store assignment for history
    const assignment = new TreasurerAssignment({
      ownerId,
      month,
      year,
    });
    await assignment.save();

    res.status(200).json({
      message: `Treasurer assigned successfully for ${month}-${year}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get treasurer details by month & year
const getTreasurerByMonthYear = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ error: "month and year are required query parameters" });
    }

    // Convert query params to numbers
    const numericMonth = Number(month);
    const numericYear = Number(year);

    // Find the treasurer assignment and populate owner details
    const assignment = await TreasurerAssignment.findOne({
      month: numericMonth,
      year: numericYear,
    }).populate("ownerId");

    if (!assignment) {
      return res
        .status(404)
        .json({ error: `No treasurer assigned for ${month}-${year}` });
    }

    // ✅ Return only the owner details
    res.status(200).json({
      message: `Treasurer details for ${month}-${year}`,
      data: assignment.ownerId, // only owner info
    });
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
  assignTreasurer,
  getTreasurerByMonthYear,
};
