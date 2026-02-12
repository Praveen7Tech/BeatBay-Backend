export interface NotifyFriendsStatusDTO {
  userId: string;
  newState: "connected" | "none";
}