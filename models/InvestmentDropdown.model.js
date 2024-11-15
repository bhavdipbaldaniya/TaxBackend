const mongoose = require("mongoose");


const InvestmentIncomeDropdownModel = new mongoose.Schema(
  {
    income_type: {
      type: String,
      required: true,
    },
    // fed_tax_income: {
    //     type: Boolean,
    //     required: true,
    //   },
    // is_active:{
    //     type:Number,
    //     default:0
    // },  

  },
  { timestamps: { createdAt: false, updatedAt: false } }
);


const InvestmentIncomeDropdown  = new mongoose.model("Investment_Income_Dropdown",InvestmentIncomeDropdownModel);
module.exports = InvestmentIncomeDropdown;
