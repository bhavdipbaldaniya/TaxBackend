const express = require("express");
const { v4: uuidv4 } = require("uuid");
const multer=require("multer")
const path=require("path");

const {
  Register,
  Login,
  GetProfile,
  EditProfile,
  forgetPasswordMail,
  VerifyLink,
  ResetForgotPassword,
  DashboardDetails,
  ResetPassword
 
} = require("../controllers/users.controllers");

const {
  GetResidentStates,
  GetMaritalStatus,
  GetTaxFillingStatus,
  GetInvestmentFrequency,
  AddProfileBasic,
  EditProfileBasic,
  GetClientProfile,
  DeleteClientProfile,
  getAllClients,
  GetProfilesForTaxForma,
  getAllTaxProfile
} = require("../controllers/clientProfile.controllers");
const {
  SignUpValidation,
  SignInValidation,
  forgetPasswordMailValidation,
} = require("../validation/AuthValidation");
const { RactifyError } = require("../middleware/RactifyError");
const { 
  GetTaxProForma,
  CreateScenario,
  GetScenario,
  EditScenario,
  DeleteScenario
 } = require("../controllers/taxProForma.controller");
const { AddClient, EditClient, ActiveDeactiveClient } = require("../controllers/client.controllers");

const AuthRouter = express.Router();

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

AuthRouter.post("/register", SignUpValidation(), RactifyError, Register);
AuthRouter.post("/login", SignInValidation(), RactifyError, Login);
AuthRouter.get("/profile", GetProfile);
AuthRouter.put("/edit-profile",upload.single("image"), EditProfile);
AuthRouter.post("/forget-password-mail",forgetPasswordMailValidation(), RactifyError,forgetPasswordMail);
AuthRouter.post("/verify-link",VerifyLink);
AuthRouter.post("/reset-password",ResetPassword);
AuthRouter.post("/set-password-mail",ResetForgotPassword);
AuthRouter.get("/dashboard-details",DashboardDetails)



AuthRouter.post("/add-client-profile",upload.single("image"),AddClient)
AuthRouter.put("/edit-client-profile",upload.single("image"),EditClient)
AuthRouter.put("/status-update",ActiveDeactiveClient)


AuthRouter.get("/get-resident-state",GetResidentStates)
AuthRouter.get("/get-marital-status",GetMaritalStatus)
AuthRouter.get("/get-tax-filling-status",GetTaxFillingStatus)
AuthRouter.get("/get-income-frequency",GetInvestmentFrequency)


AuthRouter.post("/get-profile-datatable",getAllClients)
AuthRouter.post("/get-tax-profile-datatable",getAllTaxProfile)


AuthRouter.post("/add-profile-basic",AddProfileBasic)
AuthRouter.put("/edit-profile-basic",EditProfileBasic)
AuthRouter.get("/get-client-profile",GetClientProfile)
AuthRouter.get("/get-client-profile-forma",GetProfilesForTaxForma)
AuthRouter.post("/delete-client-profile",DeleteClientProfile)


AuthRouter.get("/get-tax-pro-forma",GetTaxProForma)
AuthRouter.post("/add-scenario",CreateScenario)
AuthRouter.get("/get-scenario",GetScenario)
AuthRouter.get("/update-scenario",EditScenario)
AuthRouter.post("/delete-scenario",DeleteScenario)

module.exports = AuthRouter;
