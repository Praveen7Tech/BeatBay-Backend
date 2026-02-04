import { IArtistRevenueDashboard, ISongRevenue } from "../../../application/dto/artist/revenue/revenue.dashboard.dto";
import { IArtistRevenueUseCase } from "../../../application/interfaces/usecase/artist/revenue/getRevenue-usecase.interface";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IPayoutHistoryRepository } from "../../../domain/repositories/payoutHistory.repository";
import { IPlayRepository } from "../../../domain/repositories/play.repository";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";


export class ArtistRevenueUseCase implements IArtistRevenueUseCase {
    constructor(
        private readonly _artistRepository: IArtistRepository,
        private readonly _stripeService: IStripeService,
        private readonly _playRepository: IPlayRepository,
        private readonly _payoutHistoryRepository: IPayoutHistoryRepository
    ) {}

    async execute(artistId: string): Promise<IArtistRevenueDashboard> {
        const artist = await this._artistRepository.findById(artistId);
        if (!artist || !artist.stripeConnectId) throw new NotFoundError("Artist/Stripe account missing");

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Fetch Currency & Stripe Balance
        const currency = await this._stripeService.getArtistCurrency(artist.stripeConnectId);
        const balance = await this._stripeService.getArtistWallet(artist.stripeConnectId);
        const balanceObj = balance.available.find(b => b.currency === currency.toLowerCase());
        const pendingPayout = (balanceObj?.amount || 0) / 100;

        // Fetch Platform-wide Revenue & Plays
        const platformRevenueUSD = await this._stripeService.getNetRevenue(startOfMonth, now);
        const totalPlatformPlays = await this._playRepository.getTotalPlatformPlays(startOfMonth, now);
        const artistPoolUSD = (platformRevenueUSD * 0.90) / 100;

        // Fetch Artist & Song-wise Plays
        const artistPlays = await this._playRepository.getArtistPlayCount(artistId, startOfMonth, now);
        const songPlays = await this._playRepository.getSongWisePlays(artistId, startOfMonth, now);

        // Calculate Revenue
        const totalEstRevenue = totalPlatformPlays > 0 
            ? (artistPlays / totalPlatformPlays) * artistPoolUSD 
            : 0;
        
        const rawHistory = await this._payoutHistoryRepository.getAllPayouts(artistId);
        const payouts = rawHistory.map(p => ({
            id: p._id.toString(),
            date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: p.amount / 100, 
            status: p.status, 
            method: "Stripe Transfer",
            reference: p.stripeTransferId.substring(0, 12) + "..."
        }));

        const songStats: ISongRevenue[] = songPlays.map(song => ({
            songId: song.songId,
            songTitle: "Unknown Track", // temp name
            playCount: song.count,
            estimatedRevenue: totalPlatformPlays > 0 
                ? Number(((song.count / totalPlatformPlays) * artistPoolUSD).toFixed(4))
                : 0
        }));

        const lifetimeCents = await this._payoutHistoryRepository.getLifetimeEarnings(artistId);
        const yearlyHistory = await this._payoutHistoryRepository.getYearlyHistory(artistId);
        
        // stripe connect account login link
        const loginLink = await this._stripeService.createStripeLoginLink(artist.stripeConnectId)

        return {
            summary: {
                totalRevenue: lifetimeCents / 100,
                revenueThisMonth: Number(totalEstRevenue.toFixed(2)),
                pendingPayout,
                nextPayoutDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
                currency: currency.toUpperCase()
            },
            chartData: this._formatYearlyData(yearlyHistory),
            songStats,
            payOutsHistory: payouts,
            stripeLoginLink: loginLink
        };
    }

    private _formatYearlyData(history: any[]) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.map((m, index) => {
            const record = history.find(h => h.month === index + 1);
            return { 
                month: m, 
                revenue: record ? record.amount / 100 : 0, 
                streams: record ? record.totalPlaysInPeriod : 0 
            };
        });
    }
}
