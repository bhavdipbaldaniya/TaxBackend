const State = require('../models/State.model');
const MaritalStatus = require('../models/MaritalStatus.model');
const TaxFilingStatus = require('../models/TaxFilingStatus.model');
const ProfileBasic = require('../models/Profile.model')
const ClientProfile = require('../models/ClientProfile.model')
const GeneralIncome = require("../models/GeneralIncome.model")
const InvestmentIncome = require("../models/InvestmentIncome.model")
const SocialSecurityIncome = require("../models/SocialSecurityIncome.model")
const InvestmentFrequency = require('../models/IncomeFrequency.model')
const Dependents = require('../models/Dependents.model')
const { ErrorHandler, ResponseOk } = require('../services/ResponseServices');
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');
const mongoose = require('mongoose');

const GetResidentStates = async (req, res) => {
    try {
        let states = await State.find({
        })
        .select('state_name')
        if (!states) {
            return ErrorHandler(
                res,
                'Failed to load resident states'
            );
        }
        if(states.length <= 0){
          return ErrorHandler(res, 'No Data Present for states ');

        }
      console.log(states.length);
            return ResponseOk(res, 'Success', states);
        } catch (error) {
            console.log("Error,",error)
      return ErrorHandler(res, error);
    }
};

const GetMaritalStatus = async (req, res) => {
    try {
        let maritalStatus = await MaritalStatus.find({
        })
        
        .select('maritalStatus')
        if (!maritalStatus) {
            return ErrorHandler(
                res,
                'Failed to load marital status'
            );
        }
        if(maritalStatus.length <= 0){
          return ErrorHandler(res, 'No Data Present for Marital Status');

        }
            return ResponseOk(res, 'Success', maritalStatus);
        } catch (error) {
            console.log("Error,",error)
      return ErrorHandler(res, error);
    }
};

const GetTaxFillingStatus = async (req, res) => {
    try {
        let taxfilingStatus = await TaxFilingStatus.find({
        })
        .select('taxFilingStatus')
        if (!taxfilingStatus) {
            return ErrorHandler(
                res,
                'Failed to load tax filling status'
            );
        }
        if(taxfilingStatus.length <= 0){
          return ErrorHandler(res, 'No Data Present for Tax Filling Status');
        }
      
            return ResponseOk(res, 'Success', taxfilingStatus);
        } catch (error) {
            console.log("Error,",error)
      return ErrorHandler(res, error);
    }
};

const GetInvestmentFrequency = async (req, res) => {
  try {
      let incomeFrequency = await InvestmentFrequency.find({
      })
      .select('income_frequency')
      if (!incomeFrequency) {
          return ErrorHandler(
              res,
              'Failed to load Income Frequency'
          );
      }
      if(incomeFrequency.length <= 0){
        return ErrorHandler(res, 'No Data Present for Income Frequency');
      }
    
          return ResponseOk(res, 'Success', incomeFrequency);
      } catch (error) {
          console.log("Error,",error)
    return ErrorHandler(res, error);
  }
};

const AddProfileBasic = async (req, res) => {
  console.log("AddProfileBasic",req.auth.Id)
    try {
      let profile = new ProfileBasic({ ...req.body,parent_id:req.auth.Id,client_id:req.query.id });
      await profile.save(); 
      
        const incomeEntries = [];
        const investmentEntries =[];
        const socialEntries =[];
        const dependentsEntries =[];

        if(Array.isArray(req.body.dependents)){
          req.body.dependents.forEach(depend => {
            let dependency = new Dependents({
                client_info_id: profile._id,
                dependent_fname: depend.dependent_fname,
                dependent_lname: depend.dependent_lname,
                dependent_dob: depend.dependent_dob,
                dependent_gender: depend.dependent_gender
            });
            dependentsEntries.push(dependency.save()); 
        });
        }
        if (Array.isArray(req.body.general_income || req.body.investment_income || req.body.social_income )) {
            req.body.general_income.forEach(income => {
                console.log("income",income)
                let generalIncome = new GeneralIncome({
                    person_id: profile.person_id,
                    client_info_id: profile._id,
                    income_source: income.income_source,
                    amount: income.amount,
                    income_description: income.income_description,
                    federal_tax_income: income.federal_tax_income,
                    federal_withholding: income.federal_withholding,
                    value: income.value
                });
                incomeEntries.push(generalIncome.save()); 
            });
            req.body.investment_income.forEach(invest_income => {
                let investmentIncome = new InvestmentIncome({
                    person_id: profile.person_id,
                    client_info_id: profile._id,
                    income_source: invest_income.income_source,
                    amount: invest_income.amount,
                    income_description: invest_income.income_description,
                    investment_frequency: invest_income.investment_frequency,
                    federal_tax_income: invest_income.federal_tax_income,
                });
                investmentEntries.push(investmentIncome.save()); 

            });
            req.body.social_income.forEach(social_income => {
                let socialSecurityIncome = new SocialSecurityIncome({
                    person_id: profile.person_id,
                    client_info_id: profile._id,
                    monthly_social_security_benefit: social_income.monthly_social_security_benefit,
                    social_security_age: social_income.social_security_age,
                    retire_age: social_income.retire_age
                });
                socialEntries.push(socialSecurityIncome.save()); 
                console.log("hey3")

            });

            await Promise.all(incomeEntries);
            await Promise.all(investmentEntries);
            await Promise.all(socialEntries);
            await Promise.all(dependentsEntries);

            // console.log("General incomes saved successfully");
        } 
        if(Array.isArray(req.body.general_income_spouse || req.body.investment_income_spouse || req.body.social_income_spouse ))  {
            req.body.general_income_spouse.forEach(income => {
                console.log("income",income)
                // console.log("income2",income[1].income_source)
                let generalIncome = new GeneralIncome({
                    person_id: profile.spouse_id,
                    client_info_id: profile._id,
                    income_source: income.income_source,
                    amount: income.amount,
                    income_description: income.income_description,
                    federal_tax_income: income.federal_tax_income,
                    federal_withholding: income.federal_withholding,
                    value: income.value
                });
                incomeEntries.push(generalIncome.save()); 
            });
            req.body.investment_income_spouse.forEach(invest_income => {
                let investmentIncome = new InvestmentIncome({
                    person_id: profile.spouse_id,
                    client_info_id: profile._id,
                    income_source: invest_income.income_source,
                    amount: invest_income.amount,
                    income_description: invest_income.income_description,
                    investment_frequency: invest_income.investment_frequency,
                    federal_tax_income: invest_income.federal_tax_income,
                });
                investmentEntries.push(investmentIncome.save()); 

            });
            req.body.social_income_spouse.forEach(social_income => {
                let socialSecurityIncome = new SocialSecurityIncome({
                    person_id: profile.spouse_id,
                    client_info_id: profile._id,
                    monthly_social_security_benefit: social_income.monthly_social_security_benefit,
                    social_security_age: social_income.social_security_age,
                    retire_age: social_income.retire_age
                });
                socialEntries.push(socialSecurityIncome.save()); 
                console.log("hey3")

            });



        }
        if(Array.isArray(req.body.general_income_joint || req.body.investment_income_joint  )){
            req.body.general_income_joint.forEach(income => {
                console.log("income",income)
                // console.log("income2",income[1].income_source)
                let generalIncome = new GeneralIncome({
                    person_id: profile._id,
                    client_info_id: profile._id,
                    income_source: income.income_source,
                    amount: income.amount,
                    income_description: income.income_description,
                    federal_tax_income: income.federal_tax_income,
                    federal_withholding: income.federal_withholding,
                    value: income.value
                });
                incomeEntries.push(generalIncome.save()); 
            });
            req.body.general_income_joint.forEach(invest_income => {
                let investmentIncome = new InvestmentIncome({
                    person_id: profile._id,
                    client_info_id: profile._id,
                    income_source: invest_income.income_source,
                    amount: invest_income.amount,
                    income_description: invest_income.income_description,
                    investment_frequency: invest_income.investment_frequency,
                    federal_tax_income: invest_income.federal_tax_income,
                });
                investmentEntries.push(investmentIncome.save()); 

            });
            // req.body.general_income_joint.forEach(social_income => {
            //     let socialSecurityIncome = new SocialSecurityIncome({
            //         person_id:profile._id,
            //         client_info_id: profile._id,
            //         monthly_social_security_benefit: social_income.monthly_social_security_benefit,
            //         social_security_age: social_income.social_security_age,
            //         retire_age: social_income.retire_age
            //     });
            //     socialEntries.push(socialSecurityIncome.save()); 
            //     console.log("hey3")

            // });

        }
        // else{
        //     return ErrorHandler(res, 'Income sources should be provided as an array');
        // }

        if (!profile) {
            return ErrorHandler(res, 'Profile cannot be created');
        }

        return ResponseOk(res, 'Profile Added', profile);
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
};


const EditProfileBasic = async (req, res) => {
    try {
      console.log("Find profile by ID", req.query.id)
      const profile = await ProfileBasic.findById(req.query.id);
      if (!profile) {
        return ErrorHandler(res, 'Profile not found');
      }
  
      await ProfileBasic.updateOne(
        { _id: req.query.id },
        { $set: { ...req.body } }
      );
  
      const incomeEntries = [];
      const investmentEntries = [];
      const socialEntries = [];
      const dependentsEntries =[];

      if(Array.isArray(req.body.dependents)){
        await Dependents.deleteMany({client_info_id: profile._id });
        req.body.dependents.forEach(depend => {
          let dependency = new Dependents({
              client_info_id: profile._id,
              dependent_fname: depend.dependent_fname,
              dependent_lname: depend.dependent_lname,
              dependent_dob: depend.dependent_dob,
              dependent_gender: depend.dependent_gender
          });
          dependentsEntries.push(dependency.save()); 
      });
      }
  
      if (Array.isArray(req.body.general_income)) {
        await GeneralIncome.deleteMany({ person_id: profile.person_id, client_info_id: profile._id });
        req.body.general_income.forEach((income) => {
          let generalIncome = new GeneralIncome({
            person_id: profile.person_id,
            client_info_id: profile._id,
            income_source: income.income_source,
            amount: income.amount,
            income_description: income.income_description,
            federal_tax_income: income.federal_tax_income,
            federal_withholding: income.federal_withholding,
            value: income.value,
          });
          incomeEntries.push(generalIncome.save());
        });
      }
  
      if (Array.isArray(req.body.investment_income)) {
        await InvestmentIncome.deleteMany({ person_id: profile.person_id, client_info_id: profile._id });
        req.body.investment_income.forEach((invest_income) => {
          let investmentIncome = new InvestmentIncome({
            person_id: profile.person_id,
            client_info_id: profile._id,
            income_source: invest_income.income_source,
            amount: invest_income.amount,
            income_description: invest_income.income_description,
            investment_frequency: invest_income.investment_frequency,
            federal_tax_income: invest_income.federal_tax_income,
          });
          investmentEntries.push(investmentIncome.save());
        });
      }
  
      if (Array.isArray(req.body.social_income)) {
        await SocialSecurityIncome.deleteMany({ person_id: profile.person_id, client_info_id: profile._id });
        req.body.social_income.forEach((social_income) => {
          let socialSecurityIncome = new SocialSecurityIncome({
            person_id: profile.person_id,
            client_info_id: profile._id,
            monthly_social_security_benefit: social_income.monthly_social_security_benefit,
            social_security_age: social_income.social_security_age,
            retire_age: social_income.retire_age,
          });
          socialEntries.push(socialSecurityIncome.save());
        });
      }
  
      if (Array.isArray(req.body.general_income_spouse)) {
        await GeneralIncome.deleteMany({ person_id: profile.spouse_id, client_info_id: profile._id });
        req.body.general_income_spouse.forEach((income) => {
          let generalIncome = new GeneralIncome({
            person_id: profile.spouse_id,
            client_info_id: profile._id,
            income_source: income.income_source,
            amount: income.amount,
            income_description: income.income_description,
            federal_tax_income: income.federal_tax_income,
            federal_withholding: income.federal_withholding,
            value: income.value,
          });
          incomeEntries.push(generalIncome.save());
        });
      }
  
      if (Array.isArray(req.body.investment_income_spouse)) {
        await InvestmentIncome.deleteMany({ person_id: profile.spouse_id, client_info_id: profile._id });
        req.body.investment_income_spouse.forEach((invest_income) => {
          let investmentIncome = new InvestmentIncome({
            person_id: profile.spouse_id,
            client_info_id: profile._id,
            income_source: invest_income.income_source,
            amount: invest_income.amount,
            income_description: invest_income.income_description,
            investment_frequency: invest_income.investment_frequency,
            federal_tax_income: invest_income.federal_tax_income,
          });
          investmentEntries.push(investmentIncome.save());
        });
      }
  
      if (Array.isArray(req.body.social_income_spouse)) {
        await SocialSecurityIncome.deleteMany({ person_id: profile.spouse_id, client_info_id: profile._id });
        req.body.social_income_spouse.forEach((social_income) => {
          let socialSecurityIncome = new SocialSecurityIncome({
            person_id: profile.spouse_id,
            client_info_id: profile._id,
            monthly_social_security_benefit: social_income.monthly_social_security_benefit,
            social_security_age: social_income.social_security_age,
            retire_age: social_income.retire_age,
          });
          socialEntries.push(socialSecurityIncome.save());
        });
      }
  
      if (Array.isArray(req.body.general_income_joint)) {
        await GeneralIncome.deleteMany({ person_id: profile._id, client_info_id: profile._id });
        req.body.general_income_joint.forEach((income) => {
          let generalIncome = new GeneralIncome({
            person_id: profile._id,
            client_info_id: profile._id,
            income_source: income.income_source,
            amount: income.amount,
            income_description: income.income_description,
            federal_tax_income: income.federal_tax_income,
            federal_withholding: income.federal_withholding,
            value: income.value,
          });
          incomeEntries.push(generalIncome.save());
        });
      }
  
      if (Array.isArray(req.body.investment_income_joint)) {
        await InvestmentIncome.deleteMany({ person_id: profile._id, client_info_id: profile._id });
        req.body.investment_income_joint.forEach((invest_income) => {
          let investmentIncome = new InvestmentIncome({
            person_id: profile._id,
            client_info_id: profile._id,
            income_source: invest_income.income_source,
            amount: invest_income.amount,
            income_description: invest_income.income_description,
            investment_frequency: invest_income.investment_frequency,
            federal_tax_income: invest_income.federal_tax_income,
          });
          investmentEntries.push(investmentIncome.save());
        });
      }
  
      await Promise.all(incomeEntries);
      await Promise.all(investmentEntries);
      await Promise.all(socialEntries);
      await Promise.all(dependentsEntries);
  
      console.log("Profile and related incomes updated successfully");
  
      return ResponseOk(res, 'Profile Updated', profile);
    } catch (error) {
      console.log("Error", error);
      return ErrorHandler(res, error);
    }
};
  
// const GetClientProfile = async (req,res) =>{

//     try {
//         const Profile = await ProfileBasic.findById(req.body.id)
//         .populate('person_id'); 

//         const Profiles = Profile.toObject();

//         const generalIncome = await GeneralIncome.find({ 
//             person_id: Profile.person_id, 
//             client_info_id: Profile._id
//         });
//         const generalIncomeSpouse = await GeneralIncome.find({ 
//             person_id: Profile.spouse_id, 
//             client_info_id: Profile._id
//         });
//         const generalIncomeJoint = await GeneralIncome.find({ 
//             person_id:  Profile._id, 
//             client_info_id: Profile._id
//         });
//         const investmentIncome = await InvestmentIncome.find({ 
//             person_id: Profile.person_id, 
//             client_info_id: Profile._id
//         });
//         const investmentIncomeSpouse = await InvestmentIncome.find({ 
//             person_id: Profile.spouse_id, 
//             client_info_id: Profile._id
//         });
//         const investmentIncomeJoint = await InvestmentIncome.find({ 
//             person_id: Profile._id, 
//             client_info_id: Profile._id
//         });
//         const socialIncome = await SocialSecurityIncome.find({ 
//             person_id: Profile.person_id, 
//             client_info_id: Profile._id
//         });
//         const socialIncomeSpouse = await SocialSecurityIncome.find({ 
//             person_id: Profile.spouse_id, 
//             client_info_id: Profile._id
//         });
        
//           Profiles.generalIncome = generalIncome;
//           Profiles.generalIncomeSpouse = generalIncomeSpouse;
//           Profiles.generalIncomeJoint = generalIncomeJoint;
//           Profiles.investmentIncome = investmentIncome;
//           Profiles.investmentIncomeSpouse = investmentIncomeSpouse;
//           Profiles.investmentIncomeJoint = investmentIncomeJoint;
//           Profiles.socialIncome = socialIncome;
//           Profiles.socialIncomeSpouse = socialIncomeSpouse;
  
//           const data = {
//             Profiles
//           };
  
//           console.log("Profile", Profile);
//           return ResponseOk(res, 'Profile Details', data);

//     } catch (error) {
//         console.log("Error", error);
//         return ErrorHandler(res, error);
//     }
// }

const GetClientProfile = async (req, res) => {
    try {
      console.log("Get Client Profile",req.auth.Id)
      const Profile = await ProfileBasic.findById(req.query.id).populate('person_id');
  
      if (!Profile) {
        return ErrorHandler(res, 'Profile not found');
      }
  
      const Profiles = Profile.toObject();
      const clientInfoId = Profile._id;
  
      const [
        dependents,
        generalIncome,
        generalIncomeSpouse,
        generalIncomeJoint,
        investmentIncome,
        investmentIncomeSpouse,
        investmentIncomeJoint,
        socialIncome,
        socialIncomeSpouse
      ] = await Promise.all([
        Dependents.find({client_info_id: clientInfoId}),
        GeneralIncome.find({ person_id: Profile.person_id, client_info_id: clientInfoId }),
        GeneralIncome.find({ person_id: Profile.spouse_id, client_info_id: clientInfoId }),
        GeneralIncome.find({ person_id: clientInfoId, client_info_id: clientInfoId }),
        InvestmentIncome.find({ person_id: Profile.person_id, client_info_id: clientInfoId }),
        InvestmentIncome.find({ person_id: Profile.spouse_id, client_info_id: clientInfoId }),
        InvestmentIncome.find({ person_id: clientInfoId, client_info_id: clientInfoId }),
        SocialSecurityIncome.find({ person_id: Profile.person_id, client_info_id: clientInfoId }),
        SocialSecurityIncome.find({ person_id: Profile.spouse_id, client_info_id: clientInfoId })
      ]);
      Profiles.dependents = dependents;
      Profiles.generalIncome = generalIncome;
      Profiles.generalIncomeSpouse = generalIncomeSpouse;
      Profiles.generalIncomeJoint = generalIncomeJoint;
      Profiles.investmentIncome = investmentIncome;
      Profiles.investmentIncomeSpouse = investmentIncomeSpouse;
      Profiles.investmentIncomeJoint = investmentIncomeJoint;
      Profiles.socialIncome = socialIncome;
      Profiles.socialIncomeSpouse = socialIncomeSpouse;
  
      const data = { Profiles };
  
      console.log("Profile", Profile);
      return ResponseOk(res, 'Profile Details', data);
  
    } catch (error) {
      console.log("Error", error);
      return ErrorHandler(res, error);
    }
  };


const DeleteClientProfile = async (req, res) => {
    try {
        const profileId = new mongoose.Types.ObjectId(req.body.id);
        console.log("profileId",profileId)
        const Profile = await ProfileBasic.findById(profileId);
   console.log("profile11", Profile)
        // const profile = await ProfileBasic.findById(req.body.id);
    
      if (!Profile) {
        return ErrorHandler(res, 'Profile not found');
      }
  
      await Profile.deleteOne({ _id: req.body.id });
  
      await GeneralIncome.deleteMany({ client_info_id: Profile._id });

      await Dependents.deleteMany({ client_info_id: Profile._id });
  
      await InvestmentIncome.deleteMany({ client_info_id: Profile._id });
  
      await SocialSecurityIncome.deleteMany({ client_info_id: Profile._id });
  
      console.log("Profile and related incomes Deleted successfully");
  
      return ResponseOk(res, 'Profile Deleted', Profile);
    } catch (error) {
      console.log("Error", error);
      return ErrorHandler(res, error);
    }
  };
  
const getAllClients = async (req, res) => {
    try {
      const { draw, start, length, order, search, columns } = req.body;
  
      let search_value = search?.value;
      let column_sort_order = order.length > 0 ? order[0].dir : 'desc';
      let sort_column = order.length > 0 ? columns[order[0].column].name : '_id';
      
      // Base query with filtering and search
      let search_query = {};
  
      if (search_value) {
        search_query['$or'] = [
          { first_name: { $regex: search_value, $options: 'i' } },
          { last_name: { $regex: search_value, $options: 'i' } },
          { phone_number: { $regex: search_value, $options: 'i' } },
          { itin_number: { $regex: search_value, $options: 'i' } },
        ];
      }
  
      // Handle column-specific search
    //   columns.forEach(col => {
    //     if (col.search.value) {
    //       const searchVal = col.search.value;
    //       search_query[col.name] = { $regex: searchVal, $options: 'i' };
    //     }
    //   });
  
      // Get total records (filtered and unfiltered)
      const recordsTotal = await ClientProfile.countDocuments({});
      const recordsFiltered = await ClientProfile.countDocuments(search_query);
  
      // Fetch data with pagination and sorting
      const data = await ClientProfile.find(search_query)
        .sort({ [sort_column]: column_sort_order === 'asc' ? 1 : -1 })
        .skip(start)
        .limit(length);
  
      const info = {
        data,
        recordsFiltered,
        recordsTotal,
        draw,
      };
  
      return res.status(200).json({
        message: 'ClientProfile fetched successfully',
        info,
      });
    } catch (error) {
        console.log("error",error)
      return res.status(400).json({ error: 'An error occurred', details: error });
    }
};

const getAllTaxProfile = async (req, res) => {
  try {
    const { draw, start, length, order, search, columns } = req.body;
    const { id } = req.query;  

    let search_value = search?.value;
    let column_sort_order = order.length > 0 ? order[0].dir : 'desc';
    let sort_column = order.length > 0 ? columns[order[0].column].name : '_id';

    let search_query = {};

    if (id) {
      search_query.client_id = id;
    }

    if (search_value) {
      search_query['$or'] = [
        { year: { $regex: search_value, $options: 'i' } },
        { householdname: { $regex: search_value, $options: 'i' } }
        // { createdAt: { $regex: search_value, $options: 'i' } },
        // { itin_number: { $regex: search_value, $options: 'i' } },
      ];
    }

    const recordsTotal = await ProfileBasic.countDocuments({});
    const recordsFiltered = await ProfileBasic.countDocuments(search_query);
    const recordData = await ClientProfile.find({_id:search_query.client_id})

    const data = await ProfileBasic.find(search_query)
      .sort({ [sort_column]: column_sort_order === 'asc' ? 1 : -1 })
      .skip(start)
      .limit(length);

    const info = {
      data,
      recordsFiltered,
      recordsTotal,
      draw,
      recordData
    };

    return res.status(200).json({
      message: 'ClientProfile fetched successfully',
      info,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ error: 'An error occurred', details: error });
  }
};



const GetProfilesForTaxForma = async (req,res) =>{
  try {
    const Profile = await ProfileBasic.find();

    if (!Profile) {
      return ErrorHandler(res, 'Profile not found');
    }
    const data = Profile.map(profile => {
      return {
        name: profile?.spouse_first_name 
          ? `${profile.first_name} & ${profile.spouse_first_name}` 
          : profile.first_name,
      };
    });

    console.log("Profiles", data);
    return ResponseOk(res, 'Profile Details', data);

  } catch (error) {
    console.log("Error", error);
    return ErrorHandler(res, error);
  }
}
  
  module.exports ={
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
  }