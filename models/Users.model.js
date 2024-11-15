const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
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
    company_name:{
        type:String,
        required: false
    },
    street_address:{
        type:String,
        required: false,
    } ,
    city:{
        type:String,
        required: false
    } ,
    zip_code:{
        type:Number,
        required: false
    } ,
    profile_photo:{
        type:String,
        required: false
    } ,
    is_active:{
        type:Number,
        default:0
    },  
    role:{
        type:String,
        default:"User"
    }
    
}, { timestamps: { createdAt: true, updatedAt: true } });

  
userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
const User = new mongoose.model("User",userSchema)
module.exports = User;