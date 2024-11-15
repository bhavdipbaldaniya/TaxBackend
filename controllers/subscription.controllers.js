// const mongoose = require('mongoose');
const Subscription = require("../models/Subscription.model")
const SubscriptionFeature = require("../models/SubscriptionFeature.model")
const { ErrorHandler, ResponseOk } = require('../services/ResponseServices');
const mongoose = require('mongoose');

const AddSubscriptionPlan = async (req,res) =>{
    try {
        const existingPlan = await Subscription.findOne({ plan_title: req.body.plan_title });
        if (existingPlan) {
            return ErrorHandler(res,'Plan already exists'); 
        }
        let plans = new Subscription ({ ...req.body });
        await plans.save(); 
        console.log("plans saved", plans);

        const featuresEntries = [];
        if (Array.isArray(req.body.plan_features)) {
            req.body.plan_features.forEach(feature =>{
                console.log("feature",feature)
                let PlansFeatures = new SubscriptionFeature({
                    plan_id:plans._id,
                    plan_features:feature
                })
                featuresEntries.push(PlansFeatures.save()); 

            })
            await Promise.all(featuresEntries);

        }
        return ResponseOk(res, 'New Plan Added', plans);

    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}

const EditSubscriptionPlan = async (req,res) =>{
   try {
    const id = req.query.id

    const editablePlans = await Subscription.findById(id);
    if(!editablePlans){
   return ErrorHandler(res, 'Plan not found');
    }
  await Subscription.updateOne(
      {_id:req.query.id},
      {$set:{...req.body}}
    );

    const planFeature = [];
    if (Array.isArray(req.body.plan_features)) {
    await SubscriptionFeature.deleteMany({ plan_id: editablePlans._id});
req.body.plan_features.forEach((feature)=>{
    let PlansFeatures = new SubscriptionFeature({
        plan_id:editablePlans._id,
        plan_features:feature
    })
    planFeature.push(PlansFeatures.save()); 
})

}
const editablePlans1 = await Subscription.findById(id);
    return ResponseOk(res, 'Plan Edited Successfully', editablePlans1);

    
   } catch (error) {
    console.log("Error", error);
    return ErrorHandler(res, error);
   }
    
}

const GetSubscriptionPlansWithFeature = async (req,res) =>{
    try {
        const plans = await Subscription.findById(req.query.id);
          console.log("hey",plans)
          if(plans == null){
            return ErrorHandler(res, 'Plan not found');
          }
        const plan = plans.toObject();
        const plan_id = plans._id;

        const [planFeature] = await Promise.all([
            SubscriptionFeature.find({ plan_id: plan_id }),
        ])

        plan.planFeature = planFeature;

        const data = {plan}

        console.log("plans",data)
        return ResponseOk(res, 'Plans with Features', plan);
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}

// const GetAllSubscriptionPlansWithFeature = async (req,res) =>{
//     try {
//         const plans = await Subscription.find();
//           console.log("hey",plans)
//         // const plan = plans.toObject();
//         const planObjects = plans.map(plan => plan.toObject());

//         // const plan_id = plans._id;

//         const [planFeature] = await Promise.all([
//             SubscriptionFeature.find(),
//         ])

//         planObjects.planFeature = planFeature;

//         const data = {plan}


//         console.log("plans",data)
//         return ResponseOk(res, 'Plans with Features', data);
//     } catch (error) {
//         console.log("Error", error);
//         return ErrorHandler(res, error);
//     }
// }

const GetAllSubscriptionPlansWithFeature = async (req, res) => {
    try {
        const plans = await Subscription.find();
        const planObjects = plans.map(plan => plan.toObject());

        console.log("fjhrh",planObjects.length)
        if(planObjects.length <= 0 ){
            return ErrorHandler(res, 'No plans found');
        }
        const planFeatures = await SubscriptionFeature.find();
        const planFeaturesObjects = planFeatures.map(feature => feature.toObject());

        const featuresMap = planFeaturesObjects.reduce((acc, feature) => {
            const { plan_id, plan_features } = feature;
            if (!acc[plan_id]) {
                acc[plan_id] = [];
            }
            acc[plan_id].push(plan_features);
            return acc;
        }, {});

        const combinedPlans = planObjects.map(plan => {
            return {
                ...plan,
                features: featuresMap[plan._id.toString()] || [] 
            };
        });

        const data = {
            plans: combinedPlans
        };

        console.log("plans", data);
        return ResponseOk(res, 'Plans with Features', combinedPlans);
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
};


const DeleteSubscriptionPlans = async (req,res) =>{
    try {
        const planIdDeleted = new mongoose.Types.ObjectId(req.query.id);
        console.log("planIdDeleted",planIdDeleted)
        const Plans = await Subscription.findById(planIdDeleted);

        if (!Plans) {
            return ErrorHandler(res, 'Plan not found');
        }
        await Subscription.deleteOne({ _id:planIdDeleted });
        await SubscriptionFeature.deleteMany({ plan_id:planIdDeleted });
  
     
  
      return ResponseOk(res, 'Subscription Plan and related features Deleted successfully', {});
    } catch (error) {
        console.log("Error", error);
        return ErrorHandler(res, error);
    }
}



module.exports = {
    AddSubscriptionPlan,
    EditSubscriptionPlan,
    GetSubscriptionPlansWithFeature,
    GetAllSubscriptionPlansWithFeature,
    DeleteSubscriptionPlans
}