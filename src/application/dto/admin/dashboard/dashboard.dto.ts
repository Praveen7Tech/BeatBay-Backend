

export interface DemographicsResponseDTO{
    entity: string
    range:string
    data: DemoGraphics[]
    totalDocs: number
}

export interface DemoGraphics{
    date: string
    total: number
}

export interface EntityItem{
    label: string
    count: number
}

export interface EntityBreakDownResponse{
    users: EntityItem[]
    artists: EntityItem[]
    songs: EntityItem[]
    albums:EntityItem[]
    playlists: EntityItem[]
}

export interface UserBreakdownCounts {
  free: number;
  premium: number;
  active: number;
  blocked: number;
}

export interface SimpleStatusCounts {
  active: number;
  blocked: number;
}

export interface PlaylistVisibilityCounts {
  public: number;
  private: number;
}

export interface EntityBreakdownCounts {
  users: UserBreakdownCounts;
  artists: SimpleStatusCounts;
  songs: SimpleStatusCounts;
  albums: SimpleStatusCounts;
  playlists: PlaylistVisibilityCounts;
}
