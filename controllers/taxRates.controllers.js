const FederalTaxRates = require("../models/FederalTaxBracket.model")
const { ErrorHandler, ResponseOk } = require('../services/ResponseServices');
const mongoose = require('mongoose');





// const AddFederalTaxRates = async (req, res) => {
//     try {
//       const { year, filling_status, taxRates } = req.body; 
//       const addedTaxRates = [];
  
//       for (const taxRate of taxRates) {
//         const existingTaxRate = await FederalTaxRates.findOne({
//           tax_rates: taxRate.tax_rates,
//           income_range_start: taxRate.income_range_start,
//           income_range_end: taxRate.income_range_end,
//           filling_status: filling_status,
//           year: year,
//         });
  
//         if (existingTaxRate) {
//           return ErrorHandler(res, `Tax rate already exists for year ${year}, filling status ${filling_status}`);
//         }
  
//         const newTaxRate = new FederalTaxRates({
//           ...taxRate,
//           year: year,
//           filling_status: filling_status,
//         });
  
//         await newTaxRate.save();
//         addedTaxRates.push(newTaxRate);
//       }
  
//       return ResponseOk(res, 'Federal Tax Rates Added Successfully', addedTaxRates);
//     } catch (error) {
//         console.log("Error", error);
//         return ErrorHandler(res, error);
//     }
// };

const AddFederalTaxRates = async (req, res) => {
  try {
    const { year,filling_status, taxRates } = req.body; 
    const addedTaxRates = [];

    for (const taxRate of taxRates) {
      const existingTaxRate = await FederalTaxRates.findOne({
        tax_rates: taxRate.tax_rates,
        income_range_start: taxRate.income_range_start,
        income_range_end: taxRate.income_range_end === null ? { $exists: true } : taxRate.income_range_end, 
        filling_status: filling_status,
        year: year,
      });

      if (existingTaxRate) {
        return ErrorHandler(res, `Tax rate already exists for year ${year}, filling status ${filling_status}`);
      }

      const newTaxRate = new FederalTaxRates({
        ...taxRate,
        year: year,
        filling_status: filling_status,
      });

      await newTaxRate.save();
      addedTaxRates.push(newTaxRate);
    }

    return ResponseOk(res, 'Federal Tax Rates Added Successfully', addedTaxRates);
  } catch (error) {
      console.log("Error", error);
      return ErrorHandler(res, error);
  }
};


const EditFederalTaxRates = async (req, res) => {
    try {
      const taxRatesArray = req.body.taxRates;
      const year = req.body.year;
      const filling_status = req.body.filling_status;
  
      await FederalTaxRates.deleteMany({ year: year, filling_status: filling_status });
  
      const newTaxRates = [];
      for (const taxRate of taxRatesArray) {
        const newTaxRate = new FederalTaxRates({ ...taxRate, year, filling_status });
        await newTaxRate.save();  
        newTaxRates.push(newTaxRate);
      }
      
      return ResponseOk(res, 'Federal Tax Rates replaced successfully', newTaxRates);
    } catch (error) {
      console.log("Error", error);
      return ErrorHandler(res, error);
    }
};
  
const GetFederalTaxRatesByYearAndStatus = async (req,res) =>{
    try {
        const federalTaxBracket = await FederalTaxRates.find({year:req.query.year,filling_status:req.query.filling_status});
         
        let federalTaxBracketData = [] 
       federalTaxBracket.forEach((tax,index) =>{
        console.log(tax)
            federalTaxBracketData.push({
                incomeRange: [tax.income_range_start,tax.income_range_end],
                tax_rate: tax.tax_rates,
                year: tax.year,
                filling_status: tax.filling_status,
                id:tax._id
              });
        })

        federalTaxBracketData.sort((a, b) => a.tax_rate - b.tax_rate);
        return ResponseOk(res, 'Federal Tax Bracket for Year and Filling Status Retrieved Succcessfully', federalTaxBracketData);
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}


const GetAllFederalTaxRatesByYearAndStatus = async (req,res) =>{
  try {
      const federalTaxBracket = await FederalTaxRates.find({year:req.query.year});
       
      let federalTaxBracketData = [] 
     federalTaxBracket.forEach((tax,index) =>{
      console.log(tax)
          federalTaxBracketData.push({
              incomeRange: [tax.income_range_start,tax.income_range_end],
              tax_rate: tax.tax_rates,
              year: tax.year,
              filling_status: tax.filling_status,
              id:tax._id
            });
      })

      // federalTaxBracketData.sort((a, b) => a.tax_rate - b.tax_rate);
      return ResponseOk(res, 'Federal Tax Bracket for Year Retrieved Succcessfully', federalTaxBracketData);
  } catch (error) {
      console.log("Error", error);
      return ErrorHandler(res, error);
  }
}
const DeleteFederaltaxrateEntry = async (req,res) =>{
    try {
        const taxRateId = new mongoose.Types.ObjectId(req.body.id);
        const taxRateEntry = await FederalTaxRates.findById(taxRateId);
 
        console.log("Delete",taxRateEntry)
    
      if (!taxRateEntry) {
        return ErrorHandler(res, 'Tax rate not found');
      }
  
      await taxRateEntry.deleteOne({ _id: taxRateId });
  
  
  
      return ResponseOk(res, 'Federal Tax rate Entry Deleted', taxRateEntry);
    } catch (error) {
      console.log("Error", error);
      return ErrorHandler(res, error);
    }
}

  
  


module.exports = {
    AddFederalTaxRates,
    GetFederalTaxRatesByYearAndStatus,
    GetAllFederalTaxRatesByYearAndStatus,
    EditFederalTaxRates,
    DeleteFederaltaxrateEntry
}