const mongoose = require("mongoose");


const FederalTaxBracketModel = new mongoose.Schema(
  {
    income_range_start: {
      type: Number,
      required: true,
    },
    income_range_end: {
        type: Number,
        required: false,
    },
    tax_rates: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    filling_status: {
        type: String,
        required: true,
    },  

  },
  { timestamps: { createdAt: true, updatedAt: true } }
);


const FederalTaxBracket  = new mongoose.model("Federal_Tax_Bracket",FederalTaxBracketModel);
module.exports = FederalTaxBracket;
