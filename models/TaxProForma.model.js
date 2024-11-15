const mongoose = require("mongoose");

const ScenariosSchema = new mongoose.Schema({

    client_info_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    ScenarioName: {
        type: String,
        required: true,
    },
    TotalIncome: {
        type: Object,
        required: true,
    },
    FederalIncome: {
        type: Object,
        required: true,
    },
    WithHoldingIncome: {
        type: Object,
        required: true
    },



}, { timestamps: { createdAt: true, updatedAt: true } });


// profileSchema.pre("save", async function (next) {
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
//   });
const Scenarios = new mongoose.model("Scenarios", ScenariosSchema)
module.exports = Scenarios;