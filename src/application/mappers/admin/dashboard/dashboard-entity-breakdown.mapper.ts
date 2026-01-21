import {
  EntityBreakdownCounts,
  EntityBreakDownResponse,
  EntityItem
} from "../../../dto/admin/dashboard/dashboard.dto";

export class EntityBreakdownMapper {

  static toDTO(counts: EntityBreakdownCounts): EntityBreakDownResponse {
    return {
      users: this.mapUsers(counts),
      artists: this.mapSimple(counts.artists),
      songs: this.mapSimple(counts.songs),
      albums: this.mapSimple(counts.albums),
      playlists: this.mapPlaylists(counts)
    };
  }

  /* ---------- PRIVATE MAPPERS ---------- */

  private static mapUsers(
    counts: EntityBreakdownCounts
  ): EntityItem[] {
    return [
      { label: "Free Users", count: counts.users.free },
      { label: "Premium", count: counts.users.premium },
      { label: "Active", count: counts.users.active },
      { label: "Blocked", count: counts.users.blocked }
    ];
  }

  private static mapSimple(
    entity: { active: number; blocked: number }
  ): EntityItem[] {
    return [
      { label: "Active", count: entity.active },
      { label: "Blocked", count: entity.blocked }
    ];
  }

  private static mapPlaylists(
    counts: EntityBreakdownCounts
  ): EntityItem[] {
    return [
      { label: "Public", count: counts.playlists.public },
      { label: "Private", count: counts.playlists.private }
    ];
  }
}
