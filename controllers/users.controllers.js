const User = require('../models/Users.model');
const Token = require('../models/Token.model');
const ProForma = require("../models/TaxProForma.model")
const Clients = require("../models/Profile.model")
const { ErrorHandler, ResponseOk } = require('../services/ResponseServices');
const { sendToken } = require('../utils/TokenUtils');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { ImageValidation } = require('../validation/ImageValidation');

const Register = async (req, res) => {
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return ErrorHandler(res, 'User already exists with this email');
      }
      let user = new User({ ...req.body });
      user.save();
      if (!user) {
        return ErrorHandler(res, 'User cannot be created');
      }
      const data = { ...req.body, user_id: user._id };
      let user_details = new User(data);
      console.log('raj',user_details);
    //   await SendMailWithTemplate(
    //     {
    //       subject: 'Welcome to Tax Optimizer',
    //       user: user.name,
    //       email: user.email,
    //     },
    //     (type = 'WelcomeMail')
    //   );
      console.log('raj');
  
      return ResponseOk(res, 'Registration Successful! Please check your email to verify your account and unlock all features!', user_details);
    } catch (error) {
        console.log("Error",error)
      throw ErrorHandler(res, error);
    }
};

const Login = async (req, res) => {
    try {
        console.log("Welcome",req.body)
        
        const userData = await User.findOne({ email: req.body.email });
        // if(userData.is_active == 0){
        //   return ErrorHandler(res, 'Your Account is not verified kindly verify your account');
  
        // }
      const isMatched = await bcrypt.compare(
        req.body.password,
        userData.password
      );
      if (isMatched) {
        const users = await User.findOne({
          _id: userData._id,
        })
          .select('-password')
          .populate('_id');
        console.log("users",users);
        return sendToken(res, users);
      }
      return ErrorHandler(res, 'Invalid password');

    } catch (error) {
        console.log("Error",error)
      return ErrorHandler(res, error);
    }
};


const GetProfile = async (req, res) => {
    try {
        console.log("Loading profile,", req.auth)
        let users = await User.findOne({
            _id: req.auth.Id
        })
        .select('-password')
        .populate('_id');
        
        if (!users) {
            return ErrorHandler(
                res,
                'Failed to load refresh your page or login again'
            );
        }
        //   if (req.auth.role === 'Admin') {
            //     const TotalUsersAllowed = await TotalSubscriptionAllowed.findOne();
            //     const total_users_allowed = TotalUsersAllowed.total_users_allowed;
            //     console.log(users);
            //     users = { ...users._doc, total_users_allowed };
            //   }
            return ResponseOk(res, 'Profile retrieved successfully.', users);
        } catch (error) {
        console.log("async",error)
      return ErrorHandler(res, error);
    }
};


const EditProfile = async (req, res) => {
    try {
      const file = req?.file;
      let response = null;
      if (file) {
        const basePath = `${process.env.BACK_URL}/public/uploads/profile`;
        response = await ImageValidation(file, basePath, file.path);
      }
      console.log("tyui---->",req.body);
      console.log("qwer---->",req.auth);
      let data = req.body;
      const users = await User.findOneAndUpdate(
        { _id: req.auth.Id },
        response ? { ...data, profile_photo: response.photo } : data
      ).select('-password');
      // if (req.body.name) {
      //   await User.findOneAndUpdate(
      //     { _id: req.auth.userId },
      //     { name: req.body.name }
      //   ).select('-password');
      // }
      // if (['Admin'].includes(req.auth.role) && req.body.total_users_allowed) {
      //   const TotalUsersAllowed = await TotalSubscriptionAllowed.findOne();
      //   TotalUsersAllowed.total_users_allowed = req.body.total_users_allowed;
      //   TotalUsersAllowed.save();
      // }
      console.log("TotalUsersAllowed---->",users)
      if (!users) {
        return ErrorHandler(
          res,
          'Failed to edit refresh your page or login again'
        );
      }
  
      return ResponseOk(res, 'User details successfully updated!', users);
    } catch (error) {
      return ErrorHandler(res, error);
    }
};  


const forgetPasswordMail = async (req, res) => {
    try {
      const userData = req.userData;
      console.log("hey",userData)
      let token = await Token.findOne({ user_id: userData._id });
      if (token) await token.deleteOne();
      let resetToken = crypto.randomBytes(32).toString('hex');
      console.log('his', resetToken, userData);
  
      const Savetoken = await new Token({
        user_id: userData._id,
        token: resetToken,
        createdAt: Date.now(),
      });
      await Savetoken.save();
  
      const link = `${process.env.FRONT_URL}/passwordReset?token=${resetToken}&id=${userData._id}`;
  
      // const sent = await SendMailWithTemplate(
      //   {
      //     subject: 'Password Reset Request',
      //     user: userData.name,
      //     link,
      //     email: req.body.email,
      //   },
      //   (type = 'ForgetPassword')
      // );
      // console.log('gigi', sent);
      // if (!sent) {
      //   return ErrorHandler(res, 'Please try after sometime');
      // }
      return ResponseOk(res, 'A password reset link has been sent to your email. Please check your email', link);
    } catch (error) {
      console.log("Error",error)
      return ErrorHandler(res, 'Please try after sometime');
    }
};
  
const VerifyLink = async (req, res) => {
    try {
      let passwordResetToken = await Token.findOne({ user_id: req.body.user_id });
      if (!passwordResetToken) {
        return ErrorHandler(res, 'Link Expired');
      }
      const isValid = await bcrypt.compare(
        req.body.token,
        passwordResetToken.token
      );
      console.log("hei",isValid)
      if (!isValid) {
        return ErrorHandler(res, 'Link Expired');
      }
      return ResponseOk(res, 'Your link has been successfully verified!', {});
    } catch (error) {
      return ErrorHandler(res, 'Link Expired');
    }
};


const ResetForgotPassword = async (req, res) => {
    let passwordResetToken = await Token.findOne({ user_id: req.body.user_id });
    if (!passwordResetToken) {
      return ErrorHandler(res, 'Link Expired');
    }
    const isValid = await bcrypt.compare(
      req.body.token,
      passwordResetToken.token
    );
    if (!isValid) {
      return ErrorHandler(res, 'Link Expired');
    }
    const user = await User.findOne({ _id: req.body.user_id });
    console.log("hey--->",user)
    user.password = req.body.password;
    user.save();
    await passwordResetToken.deleteOne();
    return ResponseOk(res, 'Your password has been changed successfully', {});
};


const DashboardDetails = async (req,res) =>{
    try {
      console.log("Dashboard",req.auth.Id)
      const totalClientsAndProForma = await Clients.countDocuments({
        parent_id: req.auth.Id,
      });
      const ClientsAndProForma = await Clients.find({
        parent_id: req.auth.Id,
      });

      console.log("hey",ClientsAndProForma[0]._id)

      const ProFormaCount = await ProForma.countDocuments({
        client_info_id: ClientsAndProForma[0]._id,
      });

      const data = {
        Total: {
          TotalClients: totalClientsAndProForma,
          TotalProForma: ProFormaCount,
        },
       
      }
      console.log("Total clients",totalClientsAndProForma)
      console.log("Total forma",ProFormaCount)
      return ResponseOk(res, 'Dashboard details retrieved successfully', data);
    } catch (error) {
      console.log("error",error)
      return ErrorHandler(res, 'Link Expired');
    }
}

const ResetPassword = async (req, res) => {
  try {
    console.log("Reset Password", req.auth.Id);

    const user = await User.findOne({ _id: req.auth.Id });
    if (!user) {
      return ErrorHandler(res, 'User not found');
    }

    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) {
      return ErrorHandler(res, 'Current password is incorrect');
    }
     console.log("hatt-->",req.body.newPassword)
    user.password =  req.body.newPassword;
    await user.save();

    return ResponseOk(res, 'Your password has been changed successfully', {});
  } catch (error) {
    console.log("error", error);
    return ErrorHandler(res, 'Link Expired');
  }
};



  module.exports = {
    Register,
    Login,
    GetProfile,
    EditProfile,
    forgetPasswordMail,
    VerifyLink,
    ResetForgotPassword,
    DashboardDetails,
    ResetPassword

  };