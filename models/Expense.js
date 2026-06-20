const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: ["PLUMBER", "ELECTRICIAN", "CARPENTER", "MUNICIPALITY"],
      required: true,
    },

    serviceProviderName: {
      type: String,
      required: true,
      trim: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    amountPaid: {
      type: Number,
      required: true,
    },

    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    imageUrl: {
      type: String,
      default: null,
    },

    treasurer: {
      treasurerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
      },
      treasurerName: {
        type: String,
        required: true,
      },
      treasurerPhoneNumber: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);