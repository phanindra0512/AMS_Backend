const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    flatNumber: { type: String, required: true },
    floorNumber: { type: String, required: true },
    flatType: { type: String, required: true },
    status: { type: String, required: true }, // e.g., "Owner", "Rented"
    occupation: { type: String, required: true },
    upiID: { type: String, required: true },
    otp: { type: Number  },
    otpExpires: { type: Date },

    familyDetails: {
      spouseName: { type: String },
      numberOfChildren: { type: Number, default: 0 },
      children: [
        {
          name: { type: String, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Owner", ownerSchema);
