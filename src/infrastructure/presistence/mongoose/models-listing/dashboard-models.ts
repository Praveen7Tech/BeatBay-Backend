import { AlbumModel } from "../models/album.model";
import { ArtistModel } from "../models/artist.model";
import { FollowerModel } from "../models/followers.model";
import { PlayListModel } from "../models/playList.model";
import { SongModel } from "../models/song.model";
import { UserModel } from "../models/user.model";

export const dashBoardModels = {
    users: UserModel,
    artists: ArtistModel,
    songs:SongModel,
    albums: AlbumModel,
    playlists: PlayListModel,
    followers: FollowerModel
}