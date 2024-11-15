const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    // company_name:{
    //     type:String,
    //     required: false
    // },
    // street_address:{
    //     type:String,
    //     required: false,
    // } ,
    // city:{
    //     type:String,
    //     required: false
    // } ,
    // zip_code:{
    //     type:Number,
    //     required: false
    // } ,
    profile_photo:{
        type:String,
        required: false
    } ,
    role:{
        type:String,
        default:"Admin"
    },
    is_active:{
        type:Number,
        default:0
    }
    
}, { timestamps: { createdAt: true, updatedAt: true } });

  
adminSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
const Admin = new mongoose.model("Admin",adminSchema)
module.exports = Admin;