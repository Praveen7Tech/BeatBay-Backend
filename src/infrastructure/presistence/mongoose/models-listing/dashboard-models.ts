import { AlbumModel } from "../models/album.model";
import { ArtistModel } from "../models/artist.model";
import { FollowerModel } from "../models/followers.model";
import { PlayListModel } from "../models/playList.model";
import { SongModel } from "../models/song.model";
import { UserModel } from "../models/user.model";

import { Model } from "mongoose";
import { UserDocument } from "../models/user.model";
import { ArtistDocument } from "../models/artist.model";
import { SongDocument } from "../models/song.model";
import { AlbumDocument } from "../models/album.model";
import { PlayListDocument } from "../models/playList.model";
import { FollowerDocument } from "../models/followers.model";

export const dashBoardModels = {
    users: UserModel,
    artists: ArtistModel,
    songs:SongModel,
    albums: AlbumModel,
    playlists: PlayListModel,
    followers: FollowerModel
}


export interface IDashboardModelMap {
    users: Model<UserDocument>;
    artists: Model<ArtistDocument>;
    songs: Model<SongDocument>;
    albums: Model<AlbumDocument>;
    playlists: Model<PlayListDocument>;
    followers: Model<FollowerDocument>;
}