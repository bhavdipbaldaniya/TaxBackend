const mongoose = require("mongoose");

const socialSecurityIncomeSchema = new mongoose.Schema({
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
    monthly_social_security_benefit: {
        type: Number,
        required:true,
    },
    social_security_age: {
        type: Number,
        required: true,
    },
    retire_age: {
        type: Number,
        required: true
    }

}, { timestamps: { createdAt: true, updatedAt: true } });



const Social_Security_Income = new mongoose.model("Social_Security_Income", socialSecurityIncomeSchema)
module.exports = Social_Security_Income;