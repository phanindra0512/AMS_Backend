const Expense = require("../models/Expense");
const Owner = require("../models/Owners");

const addExpense = async (req, res) => {
  try {
    const {
      serviceType,
      customServiceType,
      serviceProviderName,
      contactNumber,
      amountPaid,
    } = req.body;

    if (
      !serviceType ||
      !serviceProviderName ||
      !contactNumber ||
      !amountPaid
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // If OTHER selected, customServiceType is mandatory
    if (
      serviceType.toUpperCase() === "OTHER" &&
      !customServiceType
    ) {
      return res.status(400).json({
        error: "Custom service type is required when serviceType is OTHER",
      });
    }

    const treasurer = await Owner.findById(req.user.id);

    if (!treasurer) {
      return res.status(404).json({
        error: "Treasurer not found",
      });
    }

    const currentDate = new Date();

    const expense = await Expense.create({
      serviceType: serviceType.toUpperCase(),

      customServiceType:
        serviceType.toUpperCase() === "OTHER"
          ? customServiceType
          : null,

      serviceProviderName,
      contactNumber,
      amountPaid,

      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),

      imageUrl: req.file ? req.file.path : null,

      treasurer: {
        treasurerId: treasurer._id,
        treasurerName: treasurer.name,
        treasurerPhoneNumber: treasurer.phoneNumber,
      },
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getExpensesByMonthYear = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        error: "Month and year are required",
      });
    }

    const expenses = await Expense.find({
      month: Number(month),
      year: Number(year),
    }).sort({ createdAt: -1 });

    const totalExpenseAmount = expenses.reduce(
      (sum, expense) => sum + expense.amountPaid,
      0
    );

    res.status(200).json({
      success: true,
      month: Number(month),
      year: Number(year),
      totalExpenses: expenses.length,
      totalExpenseAmount,
      data: expenses,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpensesByMonthYear,
};