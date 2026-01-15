import { User } from "../../../../domain/entities/user.entity";
import { Artist } from "../../../../domain/entities/arist.entity"; 
import { PlayList } from "../../../../domain/entities/playList.entiy";
import { UserProfileResponseDTO } from "../../../dto/profile/profile.dto";
import { FollowerPreview } from "../../../../domain/interfaces/following";

type PopulatedUser = Omit<User, 'followingArtists' | 'playLists' | 'followingUsers'> & {
  followingArtists: Artist[];
  followingUsers: User[]
  playLists: PlayList[];
};

export class ProfileMapper {
  static toResponseDTO(user: User,followers:FollowerPreview[]): UserProfileResponseDTO {
    const populatedUser = user as unknown as PopulatedUser;

    return {
      user: {
        id: populatedUser._id.toString(),
        name: populatedUser.name || "Anonymous",
        profilePicture: populatedUser.profilePicture || "",
        followingCount: populatedUser.followingCount || 0,
        playListCount: populatedUser.playLists?.length || 0,
      },
      followingArtists: (populatedUser.followingArtists || []).map((artist) => ({
        id: artist._id.toString(),
        name: artist.name,
        profilePicture: artist.profilePicture || "",
        role: artist.role
      })),
      followingUsers: (populatedUser.followingUsers || []).map((user)=> ({
        id: user._id.toString(),
        name: user.name,
        profilePicture: user.profilePicture || "",
        role: user.role
      })),
      playlists: (populatedUser.playLists || []).map((playlist) => ({
        id: playlist._id.toString(),
        title: playlist.name, 
        coverImageUrl: playlist.coverImageUrl,
      })),
      followers: followers
    };
  }
}
