const mongoose = require("mongoose");

const ClientProfiles = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    itin_number: {
        type: String,
        required: true,
    },
    profile_photo:{
        type:String,
        required: false
    } ,
    is_active:{
        type:Number,
        default:0
    },  
    
}, { timestamps: { createdAt: true, updatedAt: true } });

  

const ClientProfile = new mongoose.model("ClientProfiles",ClientProfiles)
module.exports = ClientProfile;