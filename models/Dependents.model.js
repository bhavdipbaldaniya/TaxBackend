const mongoose = require("mongoose");

const DependetsSchema = new mongoose.Schema({

    client_info_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    dependent_fname: {
        type: String,
        required: true,
    },
    dependent_lname: {
        type: String,
        required: true,
    },
    dependent_dob: {
        type: String,
        required: true,
    },
    dependent_gender: {
        type: String,
        required: true,
    },



}, { timestamps: { createdAt: true, updatedAt: true } });


// profileSchema.pre("save", async function (next) {
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
//   });
const Dependents = new mongoose.model("Dependents", DependetsSchema)
module.exports = Dependents;