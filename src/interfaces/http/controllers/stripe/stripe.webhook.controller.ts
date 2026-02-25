import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../middleware/auth/authMiddleware";
import { stripe } from "../../../../infrastructure/stripe/stripe.config";
import { IHandleWebHookUsecase } from "../../../../application/interfaces/usecase/premium/handleWebHook-usecase.interface";
import { StatusCode } from "../../../../common/constants/status.enum";
import logger from "../../../../infrastructure/utils/logger/logger";
import Stripe from "stripe";

const PLATFORM_SECRET = process.env.STRIPE_WEBHOOK_SECRET_PLATFORM!;
const CONNECT_SECRET = process.env.STRIPE_WEBHOOK_SECRET_CONNECT!;

export class WebHookController{
    constructor(
        private readonly _handleWebHookUsecase: IHandleWebHookUsecase
    ){}

    stripeWebHookHandle = async(req:AuthRequest, res:Response, next:NextFunction)=>{
           
            const signature = req.headers['stripe-signature'] as string

            logger.info(`stripe event reach webhook`)

             // Debug which secret is loaded
            logger.info(`Webhook secret loaded: ${PLATFORM_SECRET?.slice(0,10)}...`)
          
            let event : Stripe.Event;
            try {
               try {
                    event = stripe.webhooks.constructEvent(req.body, signature, PLATFORM_SECRET);
                    logger.info("Webhook verified with PLATFORM secret");
                } catch {
                    // If failed, try connect webhook
                    event = stripe.webhooks.constructEvent(req.body, signature, CONNECT_SECRET);
                    logger.info("Webhook verified with CONNECT secret");
                }
            } catch (error) {
                next(error)
                return res.status(StatusCode.BAD_REQUEST).send(`Webhook Error: ${error}`);
            }

            logger.info(`Event type: ${event.type}`);
            logger.info(`Event account: ${event.account ?? "platform"}`);
   
            try {
                logger.info("handle webhook usecase reach")
               await this._handleWebHookUsecase.execute(event)
               return res.status(StatusCode.OK).json({recieved: true})
            } catch (error) {
                console.error("Database updation error during premuim subscription")
                next(error)
            }
    
            //res.status(StatusCode.OK).json({success: true})
        }
}