const mongoose = require("mongoose");


const TaxFillingStatusSchema = new mongoose.Schema(
  {
    taxFilingStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: false, updatedAt: false } }
);

const TaxFillingStatus  = new mongoose.model("Tax_Filling_Status",TaxFillingStatusSchema);
module.exports = TaxFillingStatus;