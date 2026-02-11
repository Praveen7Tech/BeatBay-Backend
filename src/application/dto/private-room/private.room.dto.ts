import { RoomMember, SongData } from "../../../domain/services/redis/jamCache.service";

export interface InviteSendEvent {
  fromUserId: string;
  fromUserName: string;
  fromUserImage: string;
  toUserId: string;
}

export interface AcceptInviteEvent {
  roomId: string;           
  guestData: Omit<RoomMember, "role">;
}

export interface RejectInviteEvent {
  hostId: string;
  guestId: string;
}

/* ---------- ROOM ---------- */

export interface LeaveRoomEvent {
  userId: string;
  roomId: string;
}

export interface RemoveUserEvent {
  userId: string;
  roomId: string;
}

/* ---------- PLAYER ---------- */

export interface PlayerActionEvent {
  roomId: string;
  songData: SongData;
}

export interface PlayerTickEvent {
  roomId: string;
  time: number;
  isPlaying: boolean;
}

/* ---------- QUEUE ---------- */

export interface AddToQueueEvent {
  roomId: string;
  song: SongData;
}

export interface RemoveFromQueueEvent {
  roomId: string;
  songId: string;
}