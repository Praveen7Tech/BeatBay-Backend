import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../middleware/auth/authMiddleware";
import { stripe } from "../../../../infrastructure/stripe/stripe.config";
import { IHandleWebHookUsecase } from "../../../../application/interfaces/usecase/premium/handleWebHook-usecase.interface";
import { StatusCode } from "../../../../common/constants/status.enum";
import logger from "../../../../infrastructure/utils/logger/logger";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET_KEY

export class WebHookController{
    constructor(
        private readonly _handleWebHookUsecase: IHandleWebHookUsecase
    ){}

    stripeWebHookHandle = async(req:AuthRequest, res:Response, next:NextFunction)=>{
           
            const siggnature = req.headers['stripe-signature'] as string

            logger.info(`stripe evnt reach webhook`)
          
            let event ;
            try {
                event = stripe.webhooks.constructEvent(req.body, siggnature, WEBHOOK_SECRET!)
            } catch (error) {
                next(error)
                return res.status(StatusCode.BAD_REQUEST).send(`Webhook Error: ${error}`);
            }
   
            try {
                logger.info("handle webhook usecase reach")
               await this._handleWebHookUsecase.execute(event)
               return res.status(StatusCode.OK).json({recieved: true})
            } catch (error) {
                console.error("Database updation error during premuim subscription")
                next(error)
            }
    
            res.status(StatusCode.OK).json({success: true})
        }
}