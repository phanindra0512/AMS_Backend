// controllers/maintenanceController.js
const MaintenancePayment = require("../models/MaintenancePayment");
const TreasurerAssignment = require("../models/TreasurerAssignment");
const Owner = require("../models/Owners");
const Expense = require("../models/Expense");

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

    if (!month || !year) {
      return res.status(400).json({
        error: "Month and year are required",
      });
    }

    // Check duplicate transaction ID - Allow reuse only if previous payment was REJECTED
    const existingTxn = await MaintenancePayment.findOne({ transactionId });
    if (existingTxn && existingTxn.paymentStatus !== "REJECTED") {
      return res.status(409).json({
        error: "This transaction ID is already used",
      });
    }

    // Check if user already has an APPROVED or PENDING payment for this month
    const existingPayment = await MaintenancePayment.findOne({
      ownerId,
      month,
      year,
      paymentStatus: { $in: ["APPROVED", "PENDING"] },
    });

    if (existingPayment) {
      return res.status(409).json({
        error: "Maintenance already paid for this month",
      });
    }

    // Delete any REJECTED payment for this month/year by this owner
    await MaintenancePayment.deleteOne({
      ownerId,
      month,
      year,
      paymentStatus: "REJECTED",
    });

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

      receiptUrl: req.file ? req.file.path : null,

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

    const monthNumber = Number(month);
    const yearNumber = Number(year);

    // Maintenance Payments
    const payments = await MaintenancePayment.find({
      month: monthNumber,
      year: yearNumber,
    }).sort({ createdAt: -1 });

    // Approved collections only
    const approvedPayments = payments.filter(
      (payment) => payment.paymentStatus === "APPROVED"
    );

    const totalCollection = approvedPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Expenses for selected month/year
    const expenses = await Expense.find({
      month: monthNumber,
      year: yearNumber,
    });

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amountPaid || 0),
      0
    );

    const balanceAmount = totalCollection - totalExpenses;

    res.status(200).json({
      success: true,
      month: monthNumber,
      year: yearNumber,

      totalPayments: payments.length,
      totalCollection,
      totalExpenses,
      balanceAmount,

      data: payments,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
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

const paymentApproval = async (req, res) => {
  try {
    const { paymentId, status } = req.body;
    const treasurerId = req.user.id;

    // Validate inputs
    if (!paymentId) {
      return res.status(400).json({
        error: "Payment ID is required",
      });
    }

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        error: "Status must be either APPROVED or REJECTED",
      });
    }

    // Find the payment
    const payment = await MaintenancePayment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        error: "Payment not found",
      });
    }

    // Check if payment is still pending
    if (payment.paymentStatus !== "PENDING") {
      return res.status(400).json({
        error: `Payment is already ${payment.paymentStatus}. Cannot approve/reject again.`,
      });
    }

    // Verify treasurer is the assigned treasurer for this payment
    if (payment.treasurer.treasurerId.toString() !== treasurerId) {
      return res.status(403).json({
        error: "You are not the assigned treasurer for this payment",
      });
    }

    // Update payment status
    payment.paymentStatus = status;
    await payment.save();

    res.status(200).json({
      success: true,
      message: `Payment ${status.toLowerCase()} successfully`,
      data: payment,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTreasurerAmount = async (req, res) => {
  try {
    // Total approved collections
    const approvedPayments = await MaintenancePayment.find({
      paymentStatus: "APPROVED",
    });

    const totalCollection = approvedPayments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    // Total expenses
    const expenses = await Expense.find();

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amountPaid || 0),
      0
    );

    const treasurerAmount = totalCollection - totalExpenses;

    return res.status(200).json({
      success: true,
      totalCollection,
      totalExpenses,
      treasurerAmount,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
module.exports = {
  payMaintenance,
  getPaymentsByMonthYear,
  getPaymentsByOwnerId,
  paymentApproval,
  getTreasurerAmount,
};
