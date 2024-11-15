const mongoose = require("mongoose");


const IncomeFrequencySchema = new mongoose.Schema(
  {
    income_frequency: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: false, updatedAt: false } }
);

const IncomeFrequency  = new mongoose.model("Income_Frequency",IncomeFrequencySchema);
module.exports = IncomeFrequency;