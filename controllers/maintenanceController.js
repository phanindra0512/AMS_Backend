// controllers/maintenanceController.js
const MaintenancePayment = require("../models/MaintenancePayment");
const TreasurerAssignment = require("../models/TreasurerAssignment");
const Owner = require("../models/Owners");

const payMaintenance = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const {
      transactionId,
      month,
      year,
      flatNumber,
      ownerName,
      ownerMobile,
      amount,
      paymentType,
    } = req.body;

    // Validate owner exists
    const owner = await Owner.findById(ownerId);
    console.log("owner ---> ", owner);

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Validate transactionId
    if (!/^[0-9]{12}$/.test(transactionId)) {
      return res.status(400).json({
        error: "Transaction ID must be exactly 12 digits",
      });
    }

    // Check duplicate transaction ID
    const txnExists = await MaintenancePayment.findOne({ transactionId });
    if (txnExists) {
      return res.status(409).json({
        error: "This transaction ID is already used",
      });
    }

    if (!month || !year) {
      return res.status(400).json({
        error: "Month and year are required",
      });
    }

    // 1️⃣ Fetch treasurer for that month & year
    const assignment = await TreasurerAssignment.findOne({
      month,
      year,
    }).populate("ownerId");

    if (!assignment || !assignment.ownerId) {
      return res.status(404).json({
        error: "Treasurer not assigned for this month",
      });
    }

    // 2️⃣ Create payment
    const payment = await MaintenancePayment.create({
      transactionId,
      ownerId,
      month,
      year,
      flatNumber,
      ownerName,
      ownerMobile,
      amount,
      paymentType: paymentType.toUpperCase(),

      receiptUrl: req.file ? `/uploads/receipts/${req.file.filename}` : null,

      treasurer: {
        treasurerId: assignment.ownerId._id,
        treasurerName: assignment.ownerId.name,
        treasurerPhoneNumber: assignment.ownerId.phoneNumber,
        treasurerUpiID: assignment.ownerId.upiID,
      },
    });

    res.status(201).json({
      success: true,
      message: "Maintenance payment successful",
      data: payment,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Maintenance already paid for this month",
      });
    }

    res.status(500).json({ error: err.message });
  }
};

const getPaymentsByMonthYear = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        error: "Month and year are required",
      });
    }

    const payments = await MaintenancePayment.find({
      month: Number(month),
      year: Number(year),
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      month: Number(month),
      year: Number(year),
      totalPayments: payments.length,
      data: payments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPaymentsByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        error: "Owner ID is required",
      });
    }

    // Optional: Check if owner exists
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({
        success: false,
        error: "Owner not found",
      });
    }

    const payments = await MaintenancePayment.find({ ownerId }).sort({
      year: -1,
      month: -1,
    });

    return res.status(200).json({
      success: true,
      ownerId,
      totalPayments: payments.length,
      data: payments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
module.exports = {
  payMaintenance,
  getPaymentsByMonthYear,
  getPaymentsByOwnerId,
};
