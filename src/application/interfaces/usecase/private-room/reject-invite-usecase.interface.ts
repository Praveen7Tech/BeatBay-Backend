
export interface IRejectInviteUseCase {
  execute(hostId: string, guestId: string): Promise<void>;
}
