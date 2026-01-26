import { asClass } from "awilix";
import { WebHookController } from "../../../interfaces/http/controllers/stripe/stripe.webhook.controller";
import { HandleWebHookUseCase } from "../../../usecases/user/premium/handleWebhook.UseCase";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";
import { StripeService } from "../../stripe/StripeService";

export const stripeModule = {
   
    _stripeService: asClass<IStripeService>(StripeService).scoped(),
    
    _handleWebHookUsecase: asClass(HandleWebHookUseCase).scoped(),

    webHookController: asClass(WebHookController).scoped()
}