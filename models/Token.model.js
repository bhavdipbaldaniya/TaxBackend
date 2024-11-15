const mongoose = require("mongoose");
const moment = require("moment-timezone");
const bcrypt = require("bcrypt");

const TokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
    // user_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "users",
    // },
    user_id :{
        type: String,
        required: true,
    }
  },
  { timestamps: { createdAt: false, updatedAt: false } }
);
TokenSchema.pre("save", async function (next) {
  console.log("hi in token ");
  this.token = await bcrypt.hash(this.token, 10);
  next();
});

TokenSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
TokenSchema.set("toJSON", {
  virtuals: true,
});

// module.exports = mongoose.model("Token", TokenSchema);
const Token  = new mongoose.model("Token",TokenSchema);
module.exports = Token;
