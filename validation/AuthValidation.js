const { body, check } = require("express-validator");
const { findUser,findAdmin } = require("../services/UserService");
const User = require("../models/Users.model");

const SignUpValidation = () => {
  return [
    body("full_name", "Username is required")
      .notEmpty()
      .isLength({ min: 4 })
      .withMessage("username should be four character long")
      .trim(),
    body("email", "Email is required.")
      .notEmpty()
      .isEmail()
      .withMessage("Enter valid email")
      .trim()
      .custom(async (result) => {
        const users = await findUser(result);
        console.log(users)
        if (users) {
          throw new Error("This email is already exists");
        } else {
          return true;
        }
      }),
    body("password", "Password is required")
      .notEmpty()
      // .isLength({ min: 8 })
      .withMessage("Password is required"),
    // body("confirmPassword", "Password doesn't match")
    //   .notEmpty()
    //   .custom((value, { req }) => {
    //     if (value !== req.body.password) {
    //       throw new Error("Password doesn't match");
    //     } else {
    //       return true;
    //     }
    //   }),
    // body("trading_experience", "Select Trading Experience").notEmpty(),
    // body("primary_trading_style", "Select Primary Trading Style").notEmpty(),
    // body(
    //   "typical_trading_duration",
    //   "Select Typical Trading Duration"
    // ).notEmpty(),
    // body("typical_risk_tolerance", "Select Typical Risk Tolerance").notEmpty(),
    // body("age_group", "Select Age Group").notEmpty(),
  ];
};

const SignInValidation = () => {
  return [
    body("email", "Email is required.")
      .notEmpty()
      .isEmail()
      .withMessage("Enter valid email")
      .trim()
      .custom(async (result, { req }) => {
        console.log("Success",req)
        // if(req.baseUrl ==='/api/v1/admin'){
        //   const admins = await findAdmin(result);

        // }
        const users = await findUser(result);
        if (!users) {
          const admins = await findAdmin(result);
          if(!admins) {
            throw new Error("Incorrect email or password.");
          }
        } else {
          console.log("Hey",users._id)
          const usersDetails = await User.findOne({_id:users._id})
          console.log("usersDetails",usersDetails)
          req.userData = usersDetails;
          return true;
        }
      }),
    body("password", "Password is required").notEmpty(),
  ];
};
const forgetPasswordMailValidation=()=>{
  return [body("email", "Email is required.")
  .notEmpty()
  .isEmail()
  .withMessage("Enter valid email")
  .trim()
  .custom(async (result, { req }) => {
    const users = await findUser(result);
    if (!users) {
      throw new Error("This Email does not exist");
    } 
    req.userData = users;
    return true
  })]
}



const forgetPasswordMailValidationAdmin=()=>{
  return [body("email", "Email is required.")
  .notEmpty()
  .isEmail()
  .withMessage("Enter valid email")
  .trim()
  .custom(async (result, { req }) => {
    const admins = await findAdmin(result);
    if (!admins) {
      throw new Error("This Email does not exist");
    } 
    req.userData = admins;
    return true
  })]
}
module.exports = {
  SignUpValidation,
  SignInValidation,
  forgetPasswordMailValidation,
  forgetPasswordMailValidationAdmin
};
