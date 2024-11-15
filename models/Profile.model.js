const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const profileSchema = new mongoose.Schema({

    client_id: {
        type: mongoose.Schema.Types.ObjectId,
       // default: new mongoose.Types.ObjectId(), 
       unique: false, 
   },
    year: {
        type: Number,
        required: true,
    },
    householdname: {
        type: String,
        required: true,
    },
    person_id: {
        // type: mongoose.Schema.Types.ObjectId,
        // default: new mongoose.Types.ObjectId(), 
        // unique: true, 
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
        unique: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true
    },
    resident_state: {
        type: String,
        required: true
    },
    marital_status: {
        type: String,
        required: true
    },
    tax_filling_status: {
        type: String,
        required: true
    },
    blindness_status: {
        type: String,
        required: true
    },
    spouse_id: {
        // type: mongoose.Schema.Types.ObjectId,
        // default: new mongoose.Types.ObjectId(), 
        // unique: true, 
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(), 
        unique: true,
    },
    spouse_first_name: {
        type: String,
        required: false
    },
    spouse_last_name: {
        type: String,
        required: false
    },
    spouse_dob: {
        type: String,
        required: false
    },
    spouse_gender: {
        type: String,
        required: false
    },
    spouse_blindness_status: {
        type: String,
        required: false
    },
    deduction_status: {
        type: String,
        required: true
    },
    federal_deduction: {
        type: Number,
        required: true
    },
    tax_eligible_dependent_deduction: {
        type: Number,
        required: true
    },
    parent_id: {
         type: mongoose.Schema.Types.ObjectId,
        // default: new mongoose.Types.ObjectId(), 
        unique: false, 
    },
    dependent_status:{
        type: String,
        required: true
    },
    dependent_fname:{
        type: String,
        required: false,
    },
    dependent_lname:{
        type: String,
        required: false,
    },
    dependent_dob:{
        type: String,
        required: false,
    },
    dependent_gender:{
        type: String,
        required: false,
    }



}, { timestamps: { createdAt: true, updatedAt: true } });


// profileSchema.pre("save", async function (next) {
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
//   });
const Profile = new mongoose.model("Profile", profileSchema)
module.exports = Profile;


// const User = mongoose.model("User", userSchema);