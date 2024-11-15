
const mongoose = require("mongoose");

const SubscriptionFeatureModel = new mongoose.Schema(
    {
      plan_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubscriptionModel', 
        required: true,
      },
      plan_features: {
          type: String,
          required: true,
      },
     
  
    },
    { timestamps: { createdAt: false, updatedAt: false } }
  );

  const Subscription_Plans_Feature  = new mongoose.model("Subscription_Plans_Feature",SubscriptionFeatureModel);
  module.exports = Subscription_Plans_Feature;