export interface SongRevenueChartItemDTO {
  label: string;       // Jan, Feb, Mar
  revenue: number;     // in rupees/dollars (already divided)
}

export interface SongPayoutHistoryDTO {
  payoutId: string;
  revenue: number;
  period: string;      // "Jan 2026"
}

export interface SongRevenueDashboardResponseDTO {
  lifetimeRevenue: number;
  thisYearRevenue: number;
  monthlyChart: SongRevenueChartItemDTO[];
  payouts: SongPayoutHistoryDTO[];
}
