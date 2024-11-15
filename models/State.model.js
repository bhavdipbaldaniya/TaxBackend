const mongoose = require("mongoose");


const StateSchema = new mongoose.Schema(
  {
    state_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: false, updatedAt: false } },
);
// TokenSchema.pre("save", async function (next) {
//   console.log("hi in token ");
//   this.token = await bcrypt.hash(this.token, 10);
//   next();
// });

// TokenSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });
// TokenSchema.set("toJSON", {
//   virtuals: true,
// });

// module.exports = mongoose.model("Token", TokenSchema);
const States  = new mongoose.model("States",StateSchema);
module.exports = States;
