const StandardDeduction = require("../models/StandarizedDeduction.model")
const { ErrorHandler, ResponseOk } = require('../services/ResponseServices');
const mongoose = require('mongoose');


// const AddStandardDeductionRates = async (req,res) =>{
//     try {

//         const existingDeduction = await StandardDeduction.findOne({ filling_status: req.body.filling_status });
//         if (existingDeduction) {
//             return ErrorHandler(res,'Standard Deduction already exists'); 
//         }
//         let deduction = new StandardDeduction ({ ...req.body });
//         await deduction.save(); 

//         return ResponseOk(res, 'New Standard Deduction Added', deduction);

//     } catch (error) {
//         console.log("Error", error);
//         return ErrorHandler(res, error);
//     }
// }


const AddStandardDeductionRates = async (req, res) => {
    try {
        const deductions = req.body;

        for (const deductionData of deductions) {
            const existingDeduction = await StandardDeduction.findOne({ filling_status: deductionData.filling_status, year: deductionData.year });

            if (existingDeduction) {
                return ErrorHandler(res, `Standard Deduction for ${deductionData.filling_status} already exists for the year ${deductionData.year}`);
            }

            let deduction = new StandardDeduction({ ...deductionData });
            await deduction.save();
        }

        return ResponseOk(res, 'New Standard Deductions Added');

    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
};

// const EditStandardDedcutionRates = async (req, res) =>{
//     try {
//         const id = req.query.id
    
//         const editablededuction = await StandardDeduction.findById(id);
//         if(!editablededuction){
//        return ErrorHandler(res, 'Standard Deduction Entry not found');
//         }
    
//       await StandardDeduction.updateOne(
//           {_id:req.query.id},
//           {$set:{...req.body}}
//         );
    
//         return ResponseOk(res, 'Standard deduction Edited Successfully', editablededuction);
    
        
//        } catch (error) {
//         console.log("Error", error);
//         return ErrorHandler(res, error);
//        }
// }



const EditStandardDedcutionRates = async (req, res) => {
    try {
        const updates = req.body;

        for (const updateData of updates) {
            const { filling_status, year } = updateData; 
            
            const editableDeduction = await StandardDeduction.findOne({ filling_status, year });
            if (!editableDeduction) {
                return ErrorHandler(res, `Standard Deduction Entry not found for ${filling_status} in the year ${year}`);
            }

            await StandardDeduction.updateOne(
                { filling_status, year },
                { $set: { ...updateData } }
            );
        }

        return ResponseOk(res, 'Standard deductions Edited Successfully');

    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
};

const GetStandardDeductionRatesByFilter = async (req, res) => {
    try {

      let standarddeductionrates;
        if(req.query.filling_status){
             standarddeductionrates = await StandardDeduction.find({year:req.query.year,filling_status:req.query.filling_status});
        }else {
             standarddeductionrates = await StandardDeduction.find({year:req.query.year});
        }
         console.log('standarddeductionrates',standarddeductionrates.length)
         if(standarddeductionrates.length <= 0 ){
             return ErrorHandler(res, 'No Standard Deduction found for the given criteria');
         }
        return ResponseOk(res, 'Standard Deduction retrieved Succcessfully', standarddeductionrates);
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}

const GetAllStandardDeductionRates= async (req, res) => {
    try {
        const standarddeductionrates = await StandardDeduction.find({year:req.query.year});
        const allDeduction = standarddeductionrates.map(plan => plan.toObject());

        if(allDeduction.length <= 0 ){
            return ErrorHandler(res, 'No Standard Deduction found');
        }
        return ResponseOk(res, 'All Standard Deduction retrieved Succcessfully', allDeduction);
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}



const DeleteStandardDeductionRates = async (req,res) =>{
    try {
        const IdDeleted = new mongoose.Types.ObjectId(req.query.id);
        console.log("IdDeleted",IdDeleted)
        const type = await StandardDeduction.findById(IdDeleted);

        if (!type) {
            return ErrorHandler(res, 'Standard Deduction not found');
        }
        await StandardDeduction.deleteOne({ _id:IdDeleted });
  
      return ResponseOk(res, 'Standard Deduction rate has been Deleted', {});
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}

module.exports = {
    AddStandardDeductionRates,
    EditStandardDedcutionRates,
    GetStandardDeductionRatesByFilter,
    GetAllStandardDeductionRates,
    DeleteStandardDeductionRates
}