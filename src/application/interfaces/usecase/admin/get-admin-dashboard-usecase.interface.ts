import { DashBoardResponse } from "../../../dto/admin/admin.response.dto";

export interface IGetAdminDashBoardDataUseCase {
    execute(): Promise<DashBoardResponse>;
}