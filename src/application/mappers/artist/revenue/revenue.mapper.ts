import { IAWSS3StorageService } from "../../../../domain/services/aws/asw-s3.service";
import { ISongRevenue } from "../../../dto/artist/revenue/revenue.dashboard.dto";

export class RevenueMapper {
    static async toSongStats(
        songPlays: any[], 
        songs: any[], 
        totalPlatformPlays: number, 
        artistPoolUSD: number,
        s3Service: IAWSS3StorageService
    ): Promise<ISongRevenue[]> {
        return Promise.all(songPlays.map(async (play) => {
            const songDetail = songs.find(s => s.id.toString() === play.songId);
            
            // Generate S3 Signed URL for the cover
            const signedCoverUrl = songDetail?.coverImageUrl 
                ? await s3Service.getAccessPresignedUrl(songDetail.coverImageUrl)
                : "";

            return {
                songId: play.songId,
                songTitle: songDetail?.title || "Unknown Track",
                coverImageUrl: signedCoverUrl,
                playCount: play.count,
                estimatedRevenue: totalPlatformPlays > 0 
                    ? Number(((play.count / totalPlatformPlays) * artistPoolUSD).toFixed(4))
                    : 0
            };
        }));
    }
}
