const TaxProForma = require('../models/TaxProForma.model');
const ProfileBasic = require('../models/Profile.model')
const GeneralIncome = require("../models/GeneralIncome.model")
const InvestmentIncome = require("../models/InvestmentIncome.model")
const SocialSecurityIncome = require("../models/SocialSecurityIncome.model")
const { ErrorHandler, ResponseOk } = require('../services/ResponseServices');




const GetTaxProForma = async (req, res) => {
    try {
        const Profile = await ProfileBasic.findById(req.query.id).populate('person_id');

        if (!Profile) {
            return ErrorHandler(res, 'Profile not found');
        }

        const Profiles = Profile.toObject();
        const clientInfoId = Profile._id;

        const [
            generalIncome,
            generalIncomeSpouse,
            generalIncomeJoint,
            investmentIncome,
            investmentIncomeSpouse,
            investmentIncomeJoint,
            socialIncome,
            socialIncomeSpouse
        ] = await Promise.all([
            GeneralIncome.find({ person_id: Profile.person_id, client_info_id: clientInfoId }),
            GeneralIncome.find({ person_id: Profile.spouse_id, client_info_id: clientInfoId }),
            GeneralIncome.find({ person_id: clientInfoId, client_info_id: clientInfoId }),
            InvestmentIncome.find({ person_id: Profile.person_id, client_info_id: clientInfoId }),
            InvestmentIncome.find({ person_id: Profile.spouse_id, client_info_id: clientInfoId }),
            InvestmentIncome.find({ person_id: clientInfoId, client_info_id: clientInfoId }),
            SocialSecurityIncome.find({ person_id: Profile.person_id, client_info_id: clientInfoId }),
            SocialSecurityIncome.find({ person_id: Profile.spouse_id, client_info_id: clientInfoId })
        ]);

        const TotalIncome = {};
        const FederalIncome = {};
        const WithHoldingIncome = {};

// General Income 
        generalIncome.forEach(income => {
            TotalIncome[`${Profile.first_name} ${income.income_source}`] = income.amount;
            if(income.federal_tax_income){
                FederalIncome[`${Profile.first_name} ${income.income_source}`] = income.amount;
            }else{
                FederalIncome[`${Profile.first_name} ${income.income_source}`] = 0;
            }

            if(income.federal_withholding === true){
                // WithHoldingIncome[`${Profile.first_name} ${income.income_source}`] = income.amount * income.value;
                WithHoldingIncome[`${Profile.first_name} ${income.income_source}`] = income.value / 100 * income.amount;
            }else{
                WithHoldingIncome[`${Profile.first_name} ${income.income_source}`] = income.value;
            }
        });
        generalIncomeSpouse.forEach(income => {
            TotalIncome[`${Profile.spouse_first_name} ${income.income_source}`] = income.amount;
            if(income.federal_tax_income){
                FederalIncome[`${Profile.first_name} ${income.income_source}`] = income.amount;
            }else{
                FederalIncome[`${Profile.first_name} ${income.income_source}`] = 0;
            }

            if(income.federal_withholding === true){
                WithHoldingIncome[`${Profile.first_name} ${income.income_source}`] = income.value / 100 * income.amount;
            }else{
                WithHoldingIncome[`${Profile.first_name} ${income.income_source}`] = income.value;
            }
        });
        generalIncomeJoint.forEach(income => {
            TotalIncome[`${Profile.first_name +" "+ Profile.spouse_first_name} ${income.income_source}`] = income.amount;
            if(income.federal_tax_income){
                FederalIncome[`${Profile.first_name} ${income.income_source}`] = income.amount;
            }else{
                FederalIncome[`${Profile.first_name} ${income.income_source}`] = 0;
            }


            if(income.federal_withholding === true){
                WithHoldingIncome[`${Profile.first_name} ${income.income_source}`] = income.value / 100 * income.amount;
            }else{
                WithHoldingIncome[`${Profile.first_name} ${income.income_source}`] = income.value;
            }
        });


// Investment Income 
        investmentIncome.forEach(income => {
            TotalIncome[`${Profile.first_name} ${income.income_source}`] = income.amount;
            if(income.federal_tax_income){
                FederalIncome[`${Profile.first_name} ${income.income_source}`] = income.amount;
            }else{
                FederalIncome[`${Profile.first_name} ${income.income_source}`] = 0;
            }
        });
        investmentIncomeSpouse.forEach(income => {
            TotalIncome[`${Profile.spouse_first_name} ${income.income_source}`] = income.amount;
            if(income.federal_tax_income){
                FederalIncome[`${Profile.first_name} ${income.income_source}`] = income.amount;
            }else{
                FederalIncome[`${Profile.first_name} ${income.income_source}`] = 0;
            }
        });
        investmentIncomeJoint.forEach(income => {
            TotalIncome[`${Profile.first_name +" "+ Profile.spouse_first_name} ${income.income_source}`] = income.amount;
            if(income.federal_tax_income){
                FederalIncome[`${Profile.first_name} ${income.income_source}`] = income.amount;
            }else{
                FederalIncome[`${Profile.first_name} ${income.income_source}`] = 0;
            }
        });


// Social Income 
        socialIncome.forEach(income => {
            TotalIncome[`${Profile.first_name} Social Security`] = income.monthly_social_security_benefit;
        });
        socialIncomeSpouse.forEach(income => {
            TotalIncome[`${Profile.spouse_first_name} Social Security`] = income.monthly_social_security_benefit;
        });


     
        const data = { TotalIncome,FederalIncome,WithHoldingIncome };

        console.log("Profile", Profile);
        return ResponseOk(res, 'Profile Income Details', data);

    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
};


const CreateScenario = async (req,res) =>{
    try {
        
        const ExistingProformaCount = await TaxProForma.countDocuments({
            client_info_id: req.query.profile_id,
        });

        console.log("Existing",ExistingProformaCount)

        if(ExistingProformaCount >=3 ){
            return ErrorHandler(res, 'Maximum Scenario Limit Reached For Add Another Draft You will Need To Delete Existing Draft' );
        }
        if(!req.body.ScenarioName){
            return ErrorHandler(res, 'Scenario Name Required', );
        }
        let ProForma = new TaxProForma({ ...req.body,client_info_id:req.query.profile_id });
        await ProForma.save(); 
        console.log("Scenario Saved", ProForma.client_info_id);
        return ResponseOk(res, 'Scenario Saved', ProForma);
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}
 
const GetScenario = async (req,res) =>{
    try {
        const ProForma = await TaxProForma.findById(req.query.id);
        console.log("Scenario", ProForma);
        if(ProForma == null){
            return ErrorHandler(res, 'Scenario not found');
        }
        return ResponseOk(res, 'Scenario Found', ProForma);
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}

const EditScenario = async (req, res) => {
    try {
        const id = req.query.id;

        const ProForma = await TaxProForma.findById(id);
        if (!ProForma) {
            return ErrorHandler(res, 'ProForma not found');
        }

        const updatedProForma = await TaxProForma.findByIdAndUpdate(
            id,
            { $set: { ...req.body } },
            { new: true } 
        );

        const updatedProFormaObject = updatedProForma.toObject();

        console.log("Scenario Updated", updatedProFormaObject);
        return ResponseOk(res, 'Scenario Updated', updatedProFormaObject);
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
};

const DeleteScenario = async (req, res) => {
    try {
        if(!req.query.id){
            return ErrorHandler(res, 'Scenario Id Required');
        }
        const ProForma = await TaxProForma.findByIdAndDelete(req.query.id);
        console.log("Scenario", ProForma);
        return ResponseOk(res, 'Scenario Deleted', {});
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}


  module.exports = {
    GetTaxProForma,
    CreateScenario,
    GetScenario,
    EditScenario,
    DeleteScenario
  }