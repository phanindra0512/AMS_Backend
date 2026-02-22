const mongoose = require("mongoose");

const treasurerAssignmentSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "TreasurerAssignment",
  treasurerAssignmentSchema
);
