import { AwilixContainer } from "awilix";
import cron from "node-cron";
import logger from "../utils/logger/logger";
import { IProcessMontlyPayoutUseCase } from "../../application/interfaces/usecase/payout/monthly-pyout-usecase.interface";

export const PayoutCronJob = (container: AwilixContainer)=>{

    cron.schedule("1 0 1 * *", async()=>{
        logger.info("Monthly payout cron triggerd.")

        try {
            const payoutUseCase = container.resolve<IProcessMontlyPayoutUseCase>("processMonthlyPayoutUsecase")

            await payoutUseCase.execute()
        } catch (error) {
            logger.error("Failed monthly payout cron")
            console.log(error)
        }
    })
}