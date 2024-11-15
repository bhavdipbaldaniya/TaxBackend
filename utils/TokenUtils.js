const { ResponseOk } = require("../services/ResponseServices");
const jwt = require("jsonwebtoken");

const signAccessToken = function (data) {
    console.log("Signing access token",data)
  return jwt.sign(data, process.env.ACCESS_TOKEN_KEY || "", {
    expiresIn: "1d",
  });
};

const sendToken = async (res, data) => {
    console.log("Sending token",data)
  const user_id = data._id;
  const email = data.email;
  const role = data.role;

  const accessToken = await signAccessToken({ Id: user_id,email,role });
  return ResponseOk(res, "Login successful!", {
    data,
    access_token: accessToken,
  });
};

module.exports = {
  sendToken,
};
