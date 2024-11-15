const Admin = require('../models/Admin.model');
const users = require ('../models/Users.model')
const ProForma = require ('../models/TaxProForma.model')
const Plans = require('../models/Subscription.model')
const Profile = require('../models/Profile.model')
const { ErrorHandler, ResponseOk } = require('../services/ResponseServices');
const { sendToken } = require('../utils/TokenUtils');
const bcrypt = require('bcrypt');
const { ImageValidation } = require('../validation/ImageValidation');
const crypto = require('crypto');
const Token = require('../models/Token.model');
const { Error } = require('mongoose');
const monthName = require('month');


const Register = async (req, res) => {
    try {
      const existingAdmin = await Admin.findOne({ email: req.body.email });
      if (existingAdmin) {
        return ErrorHandler(res, 'Admin already exists with this email');
      }
      let admin = new Admin({ ...req.body });
      admin.save();
      if (!admin) {
        return ErrorHandler(res, 'Admin cannot be created');
      }
      const data = { ...req.body, _id: admin._id };
      let admin_details = new Admin(data);
    //   user_details.save();
      console.log('raj',admin_details);
    //   await SendMailWithTemplate(
    //     {
    //       subject: 'Welcome to Tax Optimizer',
    //       user: user.name,
    //       email: user.email,
    //     },
    //     (type = 'WelcomeMail')
    //   );
      console.log('raj');
  
      return ResponseOk(res, 'Your registration has been successfully processed. Kindly verify your email address to activate your account.',admin_details);
    } catch (error) {
        console.log("Error",error)
      throw ErrorHandler(res, error);
    }
  };

const Login = async (req, res) => {
    try {        
        const adminData = await Admin.findOne({ email: req.body.email });

        // if(adminData.is_active == 0){
        //   return ErrorHandler(res, 'Your Account is not verified kindly verify your account');
        // }

      const isMatched = await bcrypt.compare(
        req.body.password,
        adminData.password
      );
      if (isMatched) {
        // const admins = await Admin.findOne({
        //   _id: adminData._id,
        // })
        //   .select('-password')
        //   .populate('_id');
        // console.log("admins",admins);
        return sendToken(res, adminData);
      }
      return ErrorHandler(res, 'Invalid password');
    } catch (error) {
        console.log("Error",error)
      return ErrorHandler(res, error);
    }
  };

const GetProfile = async (req, res) => {
    try {
        console.log("Loading profile admins,", req.auth)
        let admins = await Admin.findOne({
            _id: req.auth.Id
        })
        .select('-password')
        .populate('_id');
        console.log("Admin")
        if (!admins) {
            return ErrorHandler(
                res,
                'Failed to load refresh your page or login again'
            );
        }
            return ResponseOk(res, 'Success', admins);
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
     
      let data = req.body;
      const admins = await Admin.findOneAndUpdate(
        { _id: req.auth.Id },
        response ? { ...data, profile_photo: response.photo } : data
      );
     
      console.log("TotalUsersAllowed---->",admins)
      if (!admins) {
        return ErrorHandler(
          res,
          'Failed to edit refresh your page or login again'
        );
      }
  
      return ResponseOk(res, 'Profile Updated Successfully', admins);
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
      return ResponseOk(res, 'Please check your email for the password reset link. Follow the instructions to reset your password', link);
      // return ResponseOk(res, 'Please check your email for the password reset link. Follow the instructions to reset your password', {});
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
      return ResponseOk(res, 'Link verified Successfully', {});
    } catch (error) {
      return ErrorHandler(res, 'error');
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
    const user = await Admin.findOne({ _id: req.body.user_id });
    console.log("hey--->",user)
    user.password = req.body.password;
    user.save();  
    await passwordResetToken.deleteOne();
    return ResponseOk(res, 'Your password has been successfully updated', {});
  };


const ResetPassword = async (req, res) => {
    try {
      console.log("Reset Password admin", req.auth.Id);
  
      const admin = await Admin.findOne({ _id: req.auth.Id });
      if (!admin) {
        return ErrorHandler(res, 'User not found');
      }
  
      const isMatch = await bcrypt.compare(req.body.currentPassword, admin.password);
      if (!isMatch) {
        return ErrorHandler(res, 'Current password is incorrect');
      }
       admin.password =  req.body.newPassword;
      await admin.save();
  
      return ResponseOk(res, 'Your password has been changed successfully', {});
    } catch (error) {
      console.log("error", error);
      return ErrorHandler(res, 'Link Expired');
    }
  };


const DashboardDetails = async (req, res) => {
    try {
      const currentDate = new Date();
  
      const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
      const startOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
      const endOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  
      // const totalCustomersLastMonth = await users.countDocuments({
      //   createdAt: {
      //     $gte: startOfLastMonth,
      //     $lte: endOfLastMonth,
      //   },
      // });
  
      // const totalProFormaLastMonth = await ProForma.countDocuments({
      //   createdAt: {
      //     $gte: startOfLastMonth,
      //     $lte: endOfLastMonth,
      //   },
      // });
  
      // const totalPlans = await Plans.countDocuments();
  
      // const totalCustomersPreviousMonth = await users.countDocuments({
      //   createdAt: {
      //     $gte: startOfPreviousMonth,
      //     $lte: endOfPreviousMonth,
      //   },
      // });
  
      // const totalProFormaPreviousMonth = await ProForma.countDocuments({
      //   createdAt: {
      //     $gte: startOfPreviousMonth,
      //     $lte: endOfPreviousMonth,
      //   },
      // });


      const [totalCustomersLastMonth, totalProFormaLastMonth, totalPlans, totalCustomersPreviousMonth, totalProFormaPreviousMonth] = await Promise.all([
        users.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
        ProForma.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
        Plans.countDocuments(),
        users.countDocuments({ createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth } }),
        ProForma.countDocuments({ createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth } })
      ]);
      
  
      const calculatePercentageChange = (lastMonth, previousMonth) => {
        if (previousMonth === 0) {
          return lastMonth > 0 ? 100 : 0; 
        }
        return ((lastMonth - previousMonth) / previousMonth) * 100;
      };
  
      const customerPercentageChange = calculatePercentageChange(totalCustomersLastMonth, totalCustomersPreviousMonth);
      const proFormaPercentageChange = calculatePercentageChange(totalProFormaLastMonth, totalProFormaPreviousMonth);
  
      const data = {
        TotalCustomers: {
          count: totalCustomersLastMonth,
          change: customerPercentageChange > 0 ? 1 : 0,//1 for increase and 0  for decrease
          value:customerPercentageChange.toFixed(2)
        },
        TotalProForma: {
          count: totalProFormaLastMonth,
          // change: proFormaPercentageChange > 0 ? `Increase of ${proFormaPercentageChange.toFixed(2)}%` : `Decrease of ${Math.abs(proFormaPercentageChange).toFixed(2)}%`
          change: proFormaPercentageChange > 0 ? 1 : 0,
          value:proFormaPercentageChange.toFixed(2)
        },
        TotalPlans: totalPlans
      };
  
      return ResponseOk(res, 'Dashboard details retrieved successfully', data);
    } catch (error) {
      console.log('error', error);
      return ErrorHandler(res, 'Error showing data');
    }
};
  

const Graphdata = async (req, res) => {
    try {
      const { year } = req.body;
       console.log("here month",monthName(2))
      if (!year) {
        return ErrorHandler(res, 'Year is required');
      }
  
      const monthlyCounts = await users.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(`${year}-01-01`),
              $lt: new Date(`${year + 1}-01-01`)
            }
          }
        },
        {
          $group: {
            _id: { month: { $month: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.month": 1 }
        }
      ]);


      
      const monthsWithCounts = Array.from({ length: 12 }, (v, i) => ({
        month: monthName(i + 1), 
        Value: 0
      }))
  
      monthlyCounts.forEach(item => {
        const monthIndex = item._id.month - 1;
        monthsWithCounts[monthIndex].Value = item.count;
      });
      console.log(`Client count per month for year ${year}:`, monthsWithCounts);
  
      return ResponseOk(res, 'Success', { year, monthlyCounts: monthsWithCounts });
    } catch (error) {
      console.log('error', error);
      return ErrorHandler(res, 'Error showing data');
    }
};



// const getAllCustomers = async (req, res) => {
//   try {
//     const { draw, start, length, order, search, columns } = req.body;

//     let search_value = search?.value;
//     let column_sort_order = order.length > 0 ? order[0].dir : 'desc';
//     let sort_column = order.length > 0 ? columns[order[0].column].name : '_id';
    
//     // Base query with filtering and search
//     let search_query = {};

//     if (search_value) {
//       search_query['$or'] = [
//         { first_name: { $regex: search_value, $options: 'i' } },
//         { spouse_first_name: { $regex: search_value, $options: 'i' } },
//         { gender: { $regex: search_value, $options: 'i' } },
//         { resident_state: { $regex: search_value, $options: 'i' } },
//       ];
//     }

//     const recordsTotal = await users.countDocuments({});
//     const recordsFiltered = await users.countDocuments(search_query);

//     const data = await users.find(search_query)
//       .sort({ [sort_column]: column_sort_order === 'asc' ? 1 : -1 })
//       .skip(start)
//       .limit(length);

//       // console.log("hey",data)
//       const data1 = await Profile.countDocuments()
//       const data2 = await ProForma.countDocuments()

//       console.log("hey",data1,data2)
//     const info = {
//       data,
//       recordsFiltered,
//       recordsTotal,
//       draw,
//     };

//     return res.status(200).json({
//       message: 'Customer fetched successfully',
//       info,
//     });
//   } catch (error) {
//       console.log("error",error)
//     return res.status(400).json({ error: 'An error occurred', details: error });
//   }
// };
  
const getAllCustomers = async (req, res) => {
  try {
    const { draw, start, length, order, search, columns } = req.body;

    let search_value = search?.value;
    let column_sort_order = order.length > 0 ? order[0].dir : 'desc';
    let sort_column = order.length > 0 ? columns[order[0].column].name : '_id';

    let search_query = {};

    if (search_value) {
      search_query['$or'] = [
        { first_name: { $regex: search_value, $options: 'i' } },
        { spouse_first_name: { $regex: search_value, $options: 'i' } },
        { gender: { $regex: search_value, $options: 'i' } },
        { resident_state: { $regex: search_value, $options: 'i' } },
      ];
    }

    const recordsTotal = await users.countDocuments({});
    const recordsFiltered = await users.countDocuments(search_query);

    const data = await users.find(search_query)
      .sort({ [sort_column]: column_sort_order === 'asc' ? 1 : -1 })
      .skip(start)
      .limit(length);

    const enrichedData = await Promise.all(data.map(async (user) => {
      const profileCount = await Profile.countDocuments({ parent_id: user._id });

      const profiles = await Profile.find({ parent_id: user._id });

      const proformaCounts = await Promise.all(profiles.map(async (profile) => {
        const proformaCount = await ProForma.countDocuments({ client_info_id: profile._id });
        return {
          proformaCount
        };
      }));
      console.log("Prof11",profileCount)
      // console.log("Prof22",proformaCounts[0].proformaCount)
      console.log("Prof22")
      return {
        ...user.toObject(),
        profileCount,
        proformaCounts
      };
    }));

    const info = {
      data: enrichedData,
      recordsFiltered,
      recordsTotal,
      draw,
    };

    return res.status(200).json({
      message: 'Customers fetched successfully',
      info,
    });

  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ error: 'An error occurred', details: error });
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
    Graphdata,
    getAllCustomers,
    ResetPassword

  };