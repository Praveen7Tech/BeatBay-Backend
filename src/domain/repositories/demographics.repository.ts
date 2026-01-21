import { DemoGraphics, EntityBreakdownCounts } from "../../application/dto/admin/dashboard/dashboard.dto"

export type Entity = "users" | "artists" | "songs" | "albums" | "playlists"

export interface IDashBoardRepository{
    getDemographics(entity: Entity, startDate:Date): Promise<DemoGraphics[]>
    getEntityBreakDown(): Promise<EntityBreakdownCounts>
}