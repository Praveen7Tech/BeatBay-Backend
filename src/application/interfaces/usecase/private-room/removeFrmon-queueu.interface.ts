export interface IRemoveFromQueueUseCase {
  execute(roomId: string, songId: string): Promise<void>;
}
