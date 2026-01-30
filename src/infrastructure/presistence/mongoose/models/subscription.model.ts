import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { Subscription } from "../../../../domain/entities/subscription.entity";

export type SubscriptionDocument = HydratedDocument<Subscription>

const SubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  stripeSubscriptionId: { type: String, required: true, unique: true },
  stripeCustomerId: { type: String, required: true, index: true },
  stripePriceId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'past_due', 'unpaid', 'canceled', 'incomplete', 'trialing'], 
    required: true 
  },
  currentPeriodEnd: { type: Date, required: true },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  planPeriod:{
    type:String,
    enum: ['Monthly', '6 Months','yearLY']
  },
  amountUSD:{
    type:Number,
    default: 0
  },
  localAmount:{
    type: Number,
    default: 0
  },
  currency:{
    type: String
  },
  paymentMethodType:{
    type: String,
    enum: ['card', 'upi', 'paypal', "apple_pay"]
  },
  paymentMethodDetails:{
    type: String
  }
}, { timestamps: true });

export const SubscriptionModel : Model<SubscriptionDocument> = mongoose.model<SubscriptionDocument>("Subscription", SubscriptionSchema)