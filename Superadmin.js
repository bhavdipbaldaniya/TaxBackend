const { StatesData } = require('./data/StatesData');
const {MaritalStatus} =require('./data/MaritalStatusData')
const {TaxFilingStatus} =require('./data/TaxFillingStatus')
const {IncomeFrequency} = require('./data/IncomeFrequencyData')
const {StandardDeduction} = require('./data/StandardDeductionData')
const States = require('./models/State.model'); 
const Maritalstatus = require('./models/MaritalStatus.model')
const TaxFillingStatus = require('./models/TaxFilingStatus.model')
const Incomefrequency = require('./models/IncomeFrequency.model')
const StandardDeductionData = require('./models/StandarizedDeduction.model')

exports.MakeData = async () => {

  //Resident State
    await Promise.all(
        StatesData.map(async i =>{
            console.log("State",i.state_name)
            // const id_on2 = await States.findOne({
            //     where: { state_name: i.state_name },
            //   });
            const id_on2 = await States.findOne({
                state_name: { $regex: new RegExp(i.state_name, "i") }
            });
              console.log("hey status",id_on2 )
              if (!id_on2) {
                console.log('hi5');
                await States.create({state_name:i.state_name});
                // await States.insertMany(StatesData, { ordered: false });
              }
        })
    )

    //Marital Status
    await Promise.all(
        MaritalStatus.map(async i =>{
            console.log("married",i.maritalStatus)
            const id_on2 = await Maritalstatus.findOne({
                // where: { maritalStatus: i.maritalStatus },
                maritalStatus: { $regex: new RegExp(i.maritalStatus, "i") }

              });
              console.log("hey married", id_on2)
              if (!id_on2) {
                console.log('hi5');
                await Maritalstatus.create({maritalStatus:i.maritalStatus});
                // await Maritalstatus.insertMany(MaritalStatus, { ordered: false });
              }
        })
    )


  

  //Tax Filling Status
    await Promise.all(
        TaxFilingStatus.map(async i =>{
            console.log("taxFilling",i.taxFilingStatus)
            const id_on2 = await TaxFillingStatus.findOne({
                // where: { taxFilingStatus: i.taxFilingStatus },
                taxFilingStatus: { $regex: new RegExp(i.taxFilingStatus, "i") }

              });
              console.log("hey tax", id_on2)
              if (!id_on2) {
                console.log('hi5');
                await TaxFillingStatus.create({taxFilingStatus:i.taxFilingStatus});
                // await TaxFillingStatus.insertMany(TaxFilingStatus, { ordered: false });
              }
        })
    )


//Income Frequency
   await Promise.all(
    IncomeFrequency.map(async i =>{
          // console.log("income",i.income_frequency)
          const id_on2 = await Incomefrequency.findOne({
              // where: { maritalStatus: i.maritalStatus },
              income_frequency: { $regex: new RegExp(i.income_frequency, "i") }

            });
            console.log("hey income", id_on2)
            if (!id_on2) {
              console.log('hi5');
              await Incomefrequency.create({income_frequency:i.income_frequency});
              // await Maritalstatus.insertMany(MaritalStatus, { ordered: false });
            }
      })
  )


// Standard Deduction
  await Promise.all(
    StandardDeduction.map(async i =>{
        console.log("taxFilling",i)
        const id_on2 = await StandardDeductionData.findOne({
            filling_status: { $regex: new RegExp(i.filling_status, "i") }

          });
          console.log("hey tax", id_on2)
          if (!id_on2) {
            console.log('hi5');
            await StandardDeductionData.create({filling_status:i.filling_status,standard_deduction:i.standard_deduction,additional_deduction_senior:i.additional_deduction_senior,additional_deduction_blind:i.additional_deduction_blind,dependent:i.dependent,year:i.year});
          }
    })
)

};

