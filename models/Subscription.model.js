const mongoose = require("mongoose");


const SubscriptionModel = new mongoose.Schema(
  {
    plan_title: {
      type: String,
      required: true,
    },
    plan_amount: {
        type: Number,
        required: true,
      },
    plan_description: {
        type: String,
        required: true,
      },
    // plan_duration: {
    //     type: String,
    //     required: true,0
    // },
    plan_type: {
        type: String,
        required: true,
    },
    // plan_feature_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default: () => new mongoose.Types.ObjectId(), 
    //     unique: true,
    // },
    is_active:{
        type:Number,
        default:0
    },  
    is_trending:{
        type:Number,
        default:0
    },
    active_users:{
        type: Number,
        default:0
    }  

  },
  { timestamps: { createdAt: false, updatedAt: false } }
);


const Subscription_Plans  = new mongoose.model("Subscription_Plans",SubscriptionModel);
module.exports = Subscription_Plans;
