const Owners = require("../models/Owners");

// Create new owner
const createOwner = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required" });
    }
    // Check if phone number already exists
    const existingOwner = await Owners.findOne({ phoneNumber });
    if (existingOwner) {
      return res.status(400).json({ error: "Phone number already exists" });
    }
    const owner = new Owners(req.body);
    await owner.save();
    res.status(201).json(owner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all owners
const getOwners = async (req, res) => {
  try {
    const owners = await Owners.find();
    res.json(owners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owners.findById(id);
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
    const { phoneNumber } = req.body;

    if (phoneNumber) {
      // Check if another owner has the same phone number
      const existingOwner = await Owners.findOne({
        phoneNumber,
        _id: { $ne: id },
      });
      if (existingOwner) {
        return res.status(400).json({ error: "Phone number already exists" });
      }
    }

    const owner = await Owners.findByIdAndUpdate(id, req.body, {
      new: true, // return updated document
      runValidators: true, // validate before update
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    res.json(owner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports = { createOwner, getOwners, updateOwner, getOwnerById };
