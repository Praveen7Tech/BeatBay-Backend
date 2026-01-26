import express, { Router } from "express"
import { AwilixContainer } from "awilix"
import { WebHookController } from "../../controllers/stripe/stripe.webhook.controller"

export default (container: AwilixContainer): Router=> {
  const router = express.Router()

  const webhookController =
    container.resolve<WebHookController>('webHookController')

  router.post('/webhook', express.raw({ type: 'application/json' }), 
  webhookController.stripeWebHookHandle)

  return router
}
