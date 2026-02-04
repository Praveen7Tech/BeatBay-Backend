export interface ISongRevenue {
    songId: string;
    songTitle: string; 
    playCount: number;
    estimatedRevenue: number;
}

interface chartData{
    month: string;
    revenue: number;
}

interface Summary{
    totalRevenue: number;
    revenueThisMonth: number;
    pendingPayout: number;
    nextPayoutDate: string;
    currency: string
}

interface PayOuts{
     id: string;
    date: string;
    amount: number;
    status: "completed" | "pending" | "failed";
    method: string;
    reference: string;
}

export interface IArtistRevenueDashboard {
    summary: Summary
    chartData: chartData[]
    songStats: ISongRevenue[]
    payOutsHistory: PayOuts[]
    stripeLoginLink: string
}