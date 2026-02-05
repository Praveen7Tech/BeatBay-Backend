import { IArtistRevenueDashboard, ISongRevenue } from "../../../application/dto/artist/revenue/revenue.dashboard.dto";
import { IArtistRevenueUseCase } from "../../../application/interfaces/usecase/artist/revenue/getRevenue-usecase.interface";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IPayoutHistoryRepository } from "../../../domain/repositories/payoutHistory.repository";
import { IPlayRepository } from "../../../domain/repositories/play.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";

export class ArtistRevenueUseCase implements IArtistRevenueUseCase {
    constructor(
        private readonly _artistRepository: IArtistRepository,
        private readonly _stripeService: IStripeService,
        private readonly _playRepository: IPlayRepository,
        private readonly _songRepository: ISongRepository,
        private readonly _payoutHistoryRepository: IPayoutHistoryRepository,
        private readonly _awsStorageService: IAWSS3StorageService 
    ) {}

    async execute(artistId: string): Promise<IArtistRevenueDashboard> {
        const artist = await this._artistRepository.findById(artistId);
        if (!artist || !artist.stripeConnectId) throw new NotFoundError("Artist/Stripe account missing");

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [currency, balance, loginLink, platformRevenueUSD, totalPlatformPlays] = await Promise.all([
            this._stripeService.getArtistCurrency(artist.stripeConnectId),
            this._stripeService.getArtistWallet(artist.stripeConnectId),
            this._stripeService.createStripeLoginLink(artist.stripeConnectId),
            this._stripeService.getNetRevenue(startOfMonth, now),
            this._playRepository.getTotalPlatformPlays(startOfMonth, now)
        ]);

        const artistPoolUSD = (platformRevenueUSD * 0.90) / 100;
        const balanceObj = balance.available.find(b => b.currency === currency.toLowerCase());

        // artist total plays
        const artistPlays = await this._playRepository.getArtistPlayCount(artistId, startOfMonth, now);
        const songPlays = await this._playRepository.getSongWisePlays(artistId, startOfMonth, now);

        // all song data
        const songIds = songPlays.map(s => s.songId);
        const songsMetadata = await this._songRepository.findSongsByIds(songIds);

        // align song data to real metadata and url
        const songStats: ISongRevenue[] = await Promise.all(
            songPlays.map(async (play) => {

                const meta = songsMetadata.find(s => s._id.toString() === play.songId);
                const coverUrl = meta?.coverImageKey 
                    ? await this._awsStorageService.getAccessPresignedUrl(meta.coverImageKey)
                    : "";

                return {
                    songId: play.songId,
                    songTitle: meta?.title || "Unknown Track",
                    coverImageUrl: coverUrl, 
                    playCount: play.count,
                    estimatedRevenue: totalPlatformPlays > 0 
                        ? Number(((play.count / totalPlatformPlays) * artistPoolUSD).toFixed(4))
                        : 0
                };
            })
        );

        // payout history related data
        const [rawHistory, lifetimeCents, yearlyHistory] = await Promise.all([
            this._payoutHistoryRepository.getAllPayouts(artistId),
            this._payoutHistoryRepository.getLifetimeEarnings(artistId),
            this._payoutHistoryRepository.getYearlyHistory(artistId)
        ]);

        const totalEstRevenue = totalPlatformPlays > 0 
            ? (artistPlays / totalPlatformPlays) * artistPoolUSD 
            : 0;

        return {
            summary: {
                totalRevenue: lifetimeCents / 100,
                revenueThisMonth: Number(totalEstRevenue.toFixed(2)),
                pendingPayout: (balanceObj?.amount || 0) / 100,
                nextPayoutDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
                currency: currency.toUpperCase()
            },
            chartData: this._formatYearlyData(yearlyHistory),
            songStats,
            payOutsHistory: rawHistory.map(p => ({
                id: p._id.toString(),
                date: p.createdAt,
                amount: p.amount / 100, 
                status: p.status, 
                method: "Stripe Transfer",
                reference: p.stripeTransferId.substring(0, 12) + "..."
            })),
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

