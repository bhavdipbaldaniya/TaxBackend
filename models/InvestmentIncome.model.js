const mongoose = require("mongoose");

const investmentIncomeSchema = new mongoose.Schema({
    person_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profiles', 
        required: true,
    },
    client_info_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profiles', 
        required: true,
    },
    income_source: {
        type: String,
        required:true,
    },
    investment_frequency: {
        type: String,
        default: false
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
   
   
   


}, { timestamps: { createdAt: true, updatedAt: true } });


// profileSchema.pre("save", async function (next) {
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
//   });
const Investment_Income = new mongoose.model("Investment_Income", investmentIncomeSchema)
module.exports = Investment_Income;