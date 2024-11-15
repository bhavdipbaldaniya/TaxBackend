const mongoose = require("mongoose");


const StandardizationDeductionModel = new mongoose.Schema(
  {
    filling_status: {
      type: String,
      required: true,
    },
    standard_deduction: {
        type: Number,
        required: true,
    },
    additional_deduction_senior_or_blind: {
        type: Number,
        required: true,
    },
    additional_deduction_senior_and_blind: {
        type: Number,
        required: true,
    },
    dependent: {
        type: Number,
        required: false,
    },
    year: {
      type: Number,
      required: true,
  },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);


const StandardDeduction  = new mongoose.model("Standard_Deduction",StandardizationDeductionModel);
module.exports = StandardDeduction;
