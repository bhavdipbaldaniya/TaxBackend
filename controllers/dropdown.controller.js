const GeneralIncomeDropdown = require("../models/GeneralDropdown.model")
const InvestmentIncomeDropdown = require("../models/InvestmentDropdown.model")
const { ErrorHandler, ResponseOk } = require('../services/ResponseServices');
const mongoose = require('mongoose');

// const AddGeneralIncomeType = async (req,res) =>{
//     try {

//         const existingincomeType = await GeneralIncomeDropdown.findOne({ income_type: req.body.income_type });
//         if (existingincomeType) {
//             return ErrorHandler(res,'Income Type already exists'); 
//         }
//         let generalType = new GeneralIncomeDropdown ({ ...req.body });
//         await generalType.save(); 

//         return ResponseOk(res, 'New Income Type Added', generalType);

//     } catch (error) {
//         console.log("Error", error);
//         return ErrorHandler(res, error);
//     }
// }

const AddGeneralIncomeType = async (req, res) => {
    try {
        const incomeTypes = req.body.income_types; 

        if (!Array.isArray(incomeTypes) || incomeTypes.length === 0) {
            return ErrorHandler(res, 'Please provide a valid array of income types.');
        }

        const existingIncomeTypes = await GeneralIncomeDropdown.find({ income_type: { $in: incomeTypes } });

        const existingIncomeTypesSet = new Set(existingIncomeTypes.map(item => item.income_type));

        const newIncomeTypes = incomeTypes.filter(type => !existingIncomeTypesSet.has(type));

        if (newIncomeTypes.length === 0) {
            return ErrorHandler(res, 'All income types already exist');
        }

        const newGeneralTypes = newIncomeTypes.map(type => new GeneralIncomeDropdown({ income_type: type }));
        await GeneralIncomeDropdown.insertMany(newGeneralTypes);

        return ResponseOk(res, 'New Income Types Added', newGeneralTypes);

    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
};


// const EditGeneralIncomeType = async (req,res) =>{
//    try {
//     const id = req.query.id

//     const editableIncomeType = await GeneralIncomeDropdown.findById(id);
//     if(!editableIncomeType){
//    return ErrorHandler(res, 'Income Type not found');
//     }

//   await GeneralIncomeDropdown.updateOne(
//       {_id:req.query.id},
//       {$set:{...req.body}}
//     );

//     return ResponseOk(res, 'Income Type Edited Successfully', editableIncomeType);

    
//    } catch (error) {
//     console.log("Error", error);
//     return ErrorHandler(res, error);
//    }
    
// }

const EditGeneralIncomeType = async (req, res) => {
    try {
        if (!req.body.income_types) {
            return ErrorHandler(res, 'No income_types provided');
        }
        const incomeTypes = req.body.income_types; 
        await GeneralIncomeDropdown.deleteMany({});
        const newGeneralTypes = incomeTypes.map(type => new GeneralIncomeDropdown({ income_type: type }));
        await GeneralIncomeDropdown.insertMany(newGeneralTypes);

        // const updatedIncomeType = await GeneralIncomeDropdown.findOneAndUpdate(
        //     { $set: { income_types: req.body.income_types } }, 
        //     { new: true } 
        // );

        // if (!updatedIncomeType) {
        //     return ErrorHandler(res, 'Failed to update the Income Type');
        // }

        return ResponseOk(res, 'Income Type Edited Successfully');

    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
};

const GetGeneralIncomeTypeById = async (req,res) =>{
    try {
        const generalincomedropdown = await GeneralIncomeDropdown.findById(req.query.id);
         if(!generalincomedropdown){
            return ErrorHandler(res,"General income not found")
         }
        return ResponseOk(res, 'General Income Type retrieved Succcessfully', generalincomedropdown);
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}

const GetAllGeneralIncomeType = async (req, res) => {
    try {
        const allGeneralIncome = await GeneralIncomeDropdown.find();
        const generalType = allGeneralIncome.map(plan => plan.toObject());

        if(generalType.length <= 0 ){
            return ErrorHandler(res,"No General Income found")
        }
        console.log("General",generalType.length);
        return ResponseOk(res, 'All General Income Type With Feature', generalType);
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
};


const DeleteGeneralIncomeType = async (req,res) =>{
    try {
        const typeIdDeleted = new mongoose.Types.ObjectId(req.query.id);
        console.log("typeIdDeleted",typeIdDeleted)
        const type = await GeneralIncomeDropdown.findById(typeIdDeleted);

        if (!type) {
            return ErrorHandler(res, 'General Income type not found');
        }
        await GeneralIncomeDropdown.deleteOne({ _id:typeIdDeleted });
  
      return ResponseOk(res, 'General Income Type has been Deleted', {});
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}




//Investment Income Type



const AddInvestmentIncomeType = async (req,res) =>{
    try {
        const incomeTypes = req.body.income_types; 

        if (!Array.isArray(incomeTypes) || incomeTypes.length === 0) {
            return ErrorHandler(res, 'Please provide a valid array of income types.');
        }

        const existingIncomeTypes = await InvestmentIncomeDropdown.find({ income_type: { $in: incomeTypes } });

        const existingIncomeTypesSet = new Set(existingIncomeTypes.map(item => item.income_type));

        const newIncomeTypes = incomeTypes.filter(type => !existingIncomeTypesSet.has(type));

        if (newIncomeTypes.length === 0) {
            return ErrorHandler(res, 'All income types already exist');
        }

        const newGeneralTypes = newIncomeTypes.map(type => new InvestmentIncomeDropdown({ income_type: type }));
        await InvestmentIncomeDropdown.insertMany(newGeneralTypes);

        return ResponseOk(res, 'New Income Types Added', newGeneralTypes);

    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}

const EditInvestmentIncomeType = async (req,res) =>{
   try {
    if (!req.body.income_types) {
        return ErrorHandler(res, 'No income_types provided');
    }
    const incomeTypes = req.body.income_types; 
    await InvestmentIncomeDropdown.deleteMany({});
    const newGeneralTypes = incomeTypes.map(type => new InvestmentIncomeDropdown({ income_type: type }));
    await InvestmentIncomeDropdown.insertMany(newGeneralTypes);

    return ResponseOk(res, 'Income Type Edited Successfully');

    
   } catch (error) {
    console.log("Error", error);
    return ErrorHandler(res, error);
   }
    
}

const GetInvestmentIncomeTypeById = async (req,res) =>{
    try {
        const investmentincomedropdown = await InvestmentIncomeDropdown.findById(req.query.id);
        if(!investmentincomedropdown){
            return ErrorHandler(res,"Investment income not found")
         }
        return ResponseOk(res, 'Investment Income Type retrieved Succcessfully', investmentincomedropdown);
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}

const GetAllInvestmentIncomeType = async (req, res) => {
    try {
        const allInvestmentIncome = await InvestmentIncomeDropdown.find();
        const investmentType = allInvestmentIncome.map(plan => plan.toObject());
        if(investmentType.length <= 0){
            return ErrorHandler(res,"Investment income not found")
         }
        return ResponseOk(res, 'All Investment Income Type With Feature', investmentType);
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
};

const DeleteInvestmentIncomeType = async (req,res) =>{
    try {
        const typeIdDeleted = new mongoose.Types.ObjectId(req.query.id);
        console.log("typeIdDeleted",typeIdDeleted)
        const type = await InvestmentIncomeDropdown.findById(typeIdDeleted);

        if (!type) {
            return ErrorHandler(res, 'Investment Income type not found');
        }
        await InvestmentIncomeDropdown.deleteOne({ _id:typeIdDeleted });
  
      return ResponseOk(res, 'Investment Income Type has been Deleted', {});
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}


module.exports = {
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
}