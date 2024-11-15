const express = require("express");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer")
const path = require("path");

const {
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

} = require("../controllers/admin.controllers");

const {
  AddSubscriptionPlan,
  EditSubscriptionPlan,
  GetSubscriptionPlansWithFeature,
  GetAllSubscriptionPlansWithFeature,
  DeleteSubscriptionPlans
} = require("../controllers/subscription.controllers")

const {
  AddGeneralIncomeType,
  EditGeneralIncomeType,
  GetGeneralIncomeTypeById,
  GetAllGeneralIncomeType,
  DeleteGeneralIncomeType,
  AddInvestmentIncomeType,
  EditInvestmentIncomeType,
  GetInvestmentIncomeTypeById,
  GetAllInvestmentIncomeType,
  DeleteInvestmentIncomeType
} = require("../controllers/dropdown.controller");
const { 
  AddFederalTaxRates,
  GetFederalTaxRatesByYearAndStatus,
  EditFederalTaxRates,
  DeleteFederaltaxrateEntry,
  GetAllFederalTaxRatesByYearAndStatus
 } = require("../controllers/taxRates.controllers");

 const {
   AddStandardDeductionRates,
   EditStandardDedcutionRates,
   GetStandardDeductionRatesByFilter,
   GetAllStandardDeductionRates,
   DeleteStandardDeductionRates
 } = require("../controllers/standerdDeduction.controllers");

const {
  SignUpValidation,
  SignInValidation,
  forgetPasswordMailValidation,
  forgetPasswordMailValidationAdmin
} = require("../validation/AuthValidation");

const { RactifyError } = require("../middleware/RactifyError");
const { SocialSecurityBenifit } = require("../controllers/socialSecurity.controller");

const AdminRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/profile");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = uuidv4() + ext;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
});
AdminRouter.post("/register", SignUpValidation(), RactifyError, Register);
AdminRouter.post("/login", SignInValidation(), RactifyError, Login);
AdminRouter.get("/profile", GetProfile);
AdminRouter.put("/edit-profile", upload.single("image"), EditProfile);
AdminRouter.post("/reset-password",ResetPassword);
AdminRouter.get("/dashboard-details", DashboardDetails);
AdminRouter.post("/graphData", Graphdata);
AdminRouter.post("/forget-password-mail", forgetPasswordMailValidationAdmin(), RactifyError, forgetPasswordMail);
AdminRouter.post("/verify-link", VerifyLink);
AdminRouter.post("/set-password-mail", ResetForgotPassword);
AdminRouter.post("/get-client-datatable",getAllCustomers)

// Subscription Plan
AdminRouter.post("/add-plans", AddSubscriptionPlan)
AdminRouter.put("/edit-plans", EditSubscriptionPlan)
AdminRouter.get("/get-plans-by-id", GetSubscriptionPlansWithFeature)
AdminRouter.get("/get-all-plans", GetAllSubscriptionPlansWithFeature)
AdminRouter.delete("/delete-plan", DeleteSubscriptionPlans)

//Dropdown General Income
AdminRouter.post("/add-general-income-type", AddGeneralIncomeType)
AdminRouter.put("/edit-general-income-type", EditGeneralIncomeType)
AdminRouter.get("/getGeneralIncomeType", GetGeneralIncomeTypeById)
AdminRouter.get("/getAllGeneralIncomeType", GetAllGeneralIncomeType)
AdminRouter.delete("/deleteGeneralIncomeType", DeleteGeneralIncomeType)

//Dropdown Investment Income
AdminRouter.post("/add-investment-income-type", AddInvestmentIncomeType)
AdminRouter.put("/edit-investment-income-type", EditInvestmentIncomeType)
AdminRouter.get("/getInvestmentIncomeType", GetInvestmentIncomeTypeById)
AdminRouter.get("/getAllInvestmentIncomeType", GetAllInvestmentIncomeType)
AdminRouter.delete("/deleteInvestmentIncomeType", DeleteInvestmentIncomeType)


//Federal Tax Brackets
AdminRouter.post("/add-federaltax-rate",AddFederalTaxRates)
AdminRouter.get("/getFederalTaxByStatusAndYear", GetFederalTaxRatesByYearAndStatus)
AdminRouter.get("/getAllFederalTaxByYear", GetAllFederalTaxRatesByYearAndStatus)
AdminRouter.put("/edit-federaltax-rate", EditFederalTaxRates)
AdminRouter.delete("/delete-federaltax-rate", DeleteFederaltaxrateEntry)


//Standard Deductions
AdminRouter.post("/add-standard-deduction",AddStandardDeductionRates)
AdminRouter.put("/edit-standard-deduction",EditStandardDedcutionRates)
AdminRouter.get("/get-standard-deductionByStatus",GetStandardDeductionRatesByFilter)
AdminRouter.get("/getAll-standard-deduction",GetAllStandardDeductionRates)
AdminRouter.delete("/delete-standard-deduction-rate", DeleteStandardDeductionRates)


AdminRouter.post("/getSocialSecurity", SocialSecurityBenifit)


module.exports = AdminRouter;
