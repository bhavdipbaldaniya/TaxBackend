const mongoose = require("mongoose");


const MaritalStatusSchema = new mongoose.Schema(
  {
    maritalStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: false, updatedAt: false } }
);

const MaritalStatus  = new mongoose.model("Marital_Status",MaritalStatusSchema);
module.exports = MaritalStatus;