import { Model } from "mongoose";
import { DemoGraphics, EntityBreakdownCounts, EntityBreakDownResponse } from "../../../../application/dto/admin/dashboard/dashboard.dto";
import { Entity, IDashBoardRepository } from "../../../../domain/repositories/demographics.repository";

export class MongooseDashBoardRepository implements IDashBoardRepository{
    constructor(
        private readonly _dashBoardModels: Record<string, Model<any>>
    ){}

    async getDemographics(entity: "users" | "artists" | "songs" | "albums" | "playlists", startDate: Date): Promise<DemoGraphics[]> {
        
        const model = this._dashBoardModels[entity]

        return model.aggregate([
            {$match: {
                    createdAt:{$gte: startDate}
                }
            },
            {
                $group:{
                    _id:{
                        $dateToString: {format: "%Y-%m-%d", date: "$createdAt"}
                    },
                    total: {$sum: 1}
                }
            },
            {
                $project:{
                    _id:0,
                    date: "$_id",
                    total: 1
                }
            },
            {
                $sort:{date: 1}
            }
        ])
    }

    async getEntityBreakDown(): Promise<EntityBreakdownCounts> {
        const [
            freeUsers, premiumUsers,activeUsers, blockedUsers,
            activeArtists, blockedArtists,
            activeSongs, blockedSongs,
            activeAlbums,  blockedAlbums,
            publicPlaylists, privatePlaylists
        ] = await Promise.all([
            this._dashBoardModels.users.countDocuments({ status:true }),
            this._dashBoardModels.users.countDocuments({ status:true }),
            this._dashBoardModels.users.countDocuments({ status:true }),
            this._dashBoardModels.users.countDocuments({ status: false }),

            this._dashBoardModels.artists.countDocuments({ status:true }),
            this._dashBoardModels.artists.countDocuments({ status:false }),

            this._dashBoardModels.songs.countDocuments({ status:true }),
            this._dashBoardModels.songs.countDocuments({ status:false }),

            this._dashBoardModels.albums.countDocuments({ isActive: true }),
            this._dashBoardModels.albums.countDocuments({ isBlocked: true }),

            this._dashBoardModels.playlists.countDocuments({ visibility: "public" }),
            this._dashBoardModels.playlists.countDocuments({ visibility: "private" })
        ]);

        return {
            users: {
            free: freeUsers,
            premium: premiumUsers,
            active: activeUsers,
            blocked: blockedUsers
            },
            artists: {
            active: activeArtists,
            blocked: blockedArtists
            },
            songs: {
            active: activeSongs,
            blocked: blockedSongs
            },
            albums: {
            active: activeAlbums,
            blocked: blockedAlbums
            },
            playlists: {
            public: publicPlaylists,
            private: privatePlaylists
            }
        };
    }

    countDocuments(field:string,id: string, entiry: Entity): Promise<number> {
        const model = this._dashBoardModels[entiry]

        return model.countDocuments({[field]:id})
    }

}