// models/Service.js

const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: [
        "PLUMBER",
        "ELECTRICIAN",
        "CARPENTER",
        "MUNICIPALITY",
        "OTHER",
      ],
      required: true,
    },

    customServiceType: {
      type: String,
      default: null,
      trim: true,
    },

    serviceProviderName: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);