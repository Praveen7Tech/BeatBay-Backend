import { DemoGraphics, EntityBreakdownCounts } from "../../application/dto/admin/dashboard/dashboard.dto"

export type Entity = "users" | "artists" | "songs" | "albums" | "playlists" | "followers"

export interface IDashBoardRepository{
    getDemographics(entity: Entity, startDate:Date): Promise<DemoGraphics[]>
    getEntityBreakDown(): Promise<EntityBreakdownCounts>
    countDocuments(field:string,id:string,entiry:Entity): Promise<number>
    countAllDocumets(entity:Entity): Promise<number>
}