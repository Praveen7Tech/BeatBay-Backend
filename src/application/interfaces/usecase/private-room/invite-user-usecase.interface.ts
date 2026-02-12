import { InviteUserResponseDTO } from "../../../dto/private-room/invite-user.response.dto";
import { InviteSendEvent } from "../../../dto/private-room/private.room.dto";

export interface IInviteUserUseCase {
  execute(data: InviteSendEvent): Promise<InviteUserResponseDTO>;
}