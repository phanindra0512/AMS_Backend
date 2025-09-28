const Owners = require("../models/Owners");

// Create new owner
const createOwner = async (req, res) => {
  try {
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
