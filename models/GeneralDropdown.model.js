const mongoose = require("mongoose");


const GeneralIncomeDropdownModel = new mongoose.Schema(
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


const GeneralIncomeDropdown  = new mongoose.model("General_Income_Dropdown",GeneralIncomeDropdownModel);
module.exports = GeneralIncomeDropdown;
