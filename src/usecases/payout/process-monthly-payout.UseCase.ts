import { IProcessMontlyPayoutUseCase } from "../../application/interfaces/usecase/payout/monthly-pyout-usecase.interface";
import { IArtistDailyAnalyticsRepository } from "../../domain/repositories/artist.daily.analytics.repository";
import { IArtistRepository } from "../../domain/repositories/artist.repository";
import { IPayoutHistoryRepository } from "../../domain/repositories/payoutHistory.repository";
import { IPlayRepository } from "../../domain/repositories/play.repository";
import { ISongRevenueHistoryRepository } from "../../domain/repositories/song.revenue.history.repository";
import { IStripeService } from "../../domain/services/stripe/stripe.service";
import logger from "../../infrastructure/utils/logger/logger";

export class ProcessMonthlyPayoutUseCase implements IProcessMontlyPayoutUseCase{
    constructor(
        private readonly _stripeService: IStripeService,
        private readonly _playRepository: IPlayRepository,
        private readonly _artistRepository: IArtistRepository,
        private readonly _payoutHistoryRepository: IPayoutHistoryRepository,
        private readonly _dailyAnalyticsRepository: IArtistDailyAnalyticsRepository,
        private readonly _songRevenueRepository: ISongRevenueHistoryRepository
    ){}

    async execute(): Promise<void> {
        const today = new Date().toISOString().split("T")[0];
        const now = new Date()
        const month = now.getMonth()
        const year = now.getFullYear()
        const start = new Date(year, month, 1); 
        const end = new Date(year, month + 1, 0); 
        

        // get total monthly revenue
        const grossRevenue = await this._stripeService.getNetRevenue(start,end)
        const artistPool = grossRevenue * 0.90

        // aggregate total  plays for the monthe
        const stats = await this._playRepository.getMonthlyStatus(start, end);

        if(!stats){
            logger.warn("No plays found for this month");
            return 
        } 
        const {totalPlays, artistShares} = stats
 
        for(const share of artistShares){
            
            const artist = await this._artistRepository.findById(share.artistId)
            if(!artist || !artist.stripeConnectId || !artist.payOutEnabled){
                continue ;
            }
            const alreadyPaid = await this._payoutHistoryRepository.historyExist(share.artistId, month, year)
            if(alreadyPaid) continue;

            const amountToPay = (share.count / totalPlays) * artistPool;

            if(amountToPay >= 1){
                // create transaction
                const transfer = await this._stripeService.transferToArtist(
                    amountToPay,
                    artist.stripeConnectId,
                    `Revenue Share ${month}/${year}`
                );
                logger.info("payout transfer complete")

                // save payout histoy
                const payout = await this._payoutHistoryRepository.create({
                    artistId: share.artistId,
                    stripeTransferId: transfer.id,
                    amount: amountToPay,
                    period: {month, year},
                    status: "completed",
                    sharePercentage: (share.count / totalPlays) * 100,
                    totalPlaysInPeriod: share.count
                })
                logger.info("payout hitsory created")

                // song wise revenue history creation
                const songPlays = await this._playRepository.getSongWisePlays(
                    share.artistId,
                    start,
                    end
                );

                const artistRevenueCents = Math.floor(amountToPay * 100);

                const songRevenueDocs = songPlays.map(play => ({
                    artistId: share.artistId,
                    songId: play.songId,
                    payoutId: payout._id.toString(),
                    periodStart: start,
                    periodEnd: end,
                    playCount: play.count,
                    revenueAmount: Math.floor(
                        (play.count / share.count) * artistRevenueCents
                    )
                }));

                await this._songRevenueRepository.createMany(songRevenueDocs);
                logger.info("payout song hitsory created")

                // analytics update
                await this._dailyAnalyticsRepository.incrementField(share.artistId,today,"revenue",amountToPay)
            }

        }
    }
}