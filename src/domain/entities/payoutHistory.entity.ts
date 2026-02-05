export interface Period{
    month: number
    year: number
}

export type Status = "completed" | "failed"

export interface payoutHistory{
    _id: string
    artistId: string
    stripeTransferId: string
    amount: number
    totalPlaysInPeriod: number
    sharePercentage: number
    period:Period
    status: Status
}