const mongoose = require("mongoose");

const generalIncomeSchema = new mongoose.Schema({
    person_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile', 
        required: true,
    },
    client_info_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile', 
        required: true,
    },
    income_source: {
        type: String,
        required:true,
    },
    amount: {
        type: Number,
        required: true,
    },
    income_description: {
        type: String,
        required: true
    },
    federal_tax_income: {
        type: Boolean,
        default: false,
    },
    federal_withholding: {
        type: Boolean,
        default: false
    },
    value: {
        type: Number,
        required: true
    },
   


}, { timestamps: { createdAt: true, updatedAt: true } });


// profileSchema.pre("save", async function (next) {
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
//   });
const General_Income = new mongoose.model("General_Income", generalIncomeSchema)
module.exports = General_Income;