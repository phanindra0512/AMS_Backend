const mongoose = require("mongoose");

const maintenancePaymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{12}$/, // exactly 12 digits
    },
    month: { type: Number, required: true },
    year: { type: Number, required: true },

    flatNumber: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerMobile: { type: String, required: true },

    amount: { type: Number, required: true },
    paymentType: {
      type: String,
      enum: ["UPI", "Cash", "Bank Transfer"],
      required: true,
    },

    receiptUrl: { type: String },

    // Treasurer snapshot
    treasurer: {
      treasurerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
      treasurerName: String,
      treasurerPhoneNumber: String,
      treasurerUpiID: String,
    },
  },
  { timestamps: true }
);

// Prevent duplicate payment
maintenancePaymentSchema.index(
  { flatNumber: 1, month: 1, year: 1 },
  { unique: true }
);

module.exports = mongoose.model("MaintenancePayment", maintenancePaymentSchema);
