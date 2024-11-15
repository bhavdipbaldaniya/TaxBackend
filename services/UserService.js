const Users = require("../models/Users.model");
const Admins = require("../models/Admin.model");

const findUser = async (email) => {
  const users = await Users.findOne({email});
  console.log("users",users)
  return users
};
const findAdmin = async (email) => {
  const admins = await Admins.findOne({email});
  console.log("admins",admins)
  return admins
}
// const RemoveAllDetails=async(user_id)=>{
//       await UsersDetails.deleteOne({user_id})
//       await UserInput.deleteMany({user_id})
//       await  WaitingList.deleteMany({user_id})
//       await  Token.deleteMany({user_id})
//       await  Invitation.deleteMany({user_id})
//       await  SubscriptionInvitaion.deleteMany({user_id})

// }

// const GetESFront=async () => {
//     const esfront_month = await TotalSubscriptionAllowedModel.findOne().populate("ESfront_month");
// console.log("object222", esfront_month)
//     return esfront_month
  
// };
module.exports={
    findUser,
    findAdmin
    // RemoveAllDetails,GetESFront
}