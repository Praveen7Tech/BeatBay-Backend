import { AdminRevenueDashBoardChartDTO } from "../../../../application/dto/admin/revenue/revenue-dashboard.dto";
import { RevenueRange } from "../../../../application/interfaces/usecase/admin/revenue/revenue-dashboardDetails-usecase.interface";
import { PlanPeriod, Subscription, SubscriptionStatus } from "../../../../domain/entities/subscription.entity";
import { ISubscriptionRepository, PlatformRevenueStats } from "../../../../domain/repositories/subscription.repository";
import { SubscriptionModel } from "../models/subscription.model";

export class SubscriptionRepository implements ISubscriptionRepository{

    async getSubscription(userId: string): Promise<Partial<Subscription> | null> {
        const sub = await SubscriptionModel.findOne({userId})
        .sort({createdAt: -1}).lean()
        
        if(!sub) return null

        return {
            id: sub._id.toString(),
            stripeSubscriptionId: sub.stripeSubscriptionId,
            status: sub.status as SubscriptionStatus,
            planPeriod: sub.planPeriod as PlanPeriod,
            currentPeriodEnd: sub.currentPeriodEnd,
            cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
            localAmount: sub.localAmount,
            currency: sub.currency,
            paymentMethodDetails: sub.paymentMethodDetails,
        }
    }

    async getPlatformRevenueStats(): Promise<PlatformRevenueStats> {
        const now = new Date();

        const startOfMonth = new Date(now.getFullYear(),now.getMonth(),1);

        const startOfYear = new Date( now.getFullYear(),0,1);

        const [total, month, year] = await Promise.all([
        SubscriptionModel.aggregate([
            {
               $match: { status: "active" }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amountUSD" }
                }
            }
        ]),
        SubscriptionModel.aggregate([
            {
                $match: {
                    status: "active",
                    createdAt: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    thisMonthRevenue: { $sum: "$amountUSD" }
                }
            }
        ]),
        SubscriptionModel.aggregate([
            {
                $match: {
                    status: "active",
                    createdAt: { $gte: startOfYear }
                }
            },
            {
                $group: {
                    _id: null,
                    thisYearRevenue: { $sum: "$amountUSD" }
                }
            }
        ])
        ]);

        return {
            totalRevenue: (total[0]?.totalRevenue ?? 0) /100,
            thisMonthRevenue: (month[0]?.thisMonthRevenue ?? 0)/100,
            thisYearRevenue: (year[0]?.thisYearRevenue ?? 0)/ 100
        };
    }


    async getRevenueChart(range: RevenueRange): Promise<AdminRevenueDashBoardChartDTO[]> {
        const now = new Date();

        let startDate: Date;
        let buckets: string[] = [];
        let format: string;

        if (range === "weekly") {
            startDate = new Date();
            startDate.setDate(now.getDate() - 6);

            format = "%Y-%m-%d";

            for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);

            buckets.push(
                d.toLocaleDateString("en-US", { weekday: "short" })
            );
            }
        }

        else if (range === "monthly") {
            startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
            format = "%Y-%m";

            for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            buckets.push(
                d.toLocaleString("en-US", { month: "short" })
            );
            }
        }

        else {
            startDate = new Date(now.getFullYear() - 4, 0, 1);
            format = "%Y";

            for (let i = 4; i >= 0; i--) {
            buckets.push((now.getFullYear() - i).toString());
            }
        }

        const raw = await SubscriptionModel.aggregate([
            {
            $match: {
                createdAt: { $gte: startDate },
                status: "active"
            }
            },
            {
            $group: {
                _id: {
                $dateToString: {
                    format,
                    date: "$createdAt"
                }
                },
                revenue: { $sum: "$amountUSD" }
            }
            }
        ]);

        const map = new Map<string, number>();

        raw.forEach((r) => {
            const date = new Date(r._id);

            let label: string;

            if (range === "weekly") {
            label = date.toLocaleDateString("en-US", { weekday: "short" });
            } else if (range === "monthly") {
            label = date.toLocaleString("en-US", { month: "short" });
            } else {
            label = date.getFullYear().toString();
            }

            map.set(label, r.revenue / 100);
        });

        const result: AdminRevenueDashBoardChartDTO[] = buckets.map((label) => ({
            label,
            revenue: Number((map.get(label) ?? 0).toFixed(2))
        }));

        return result;
    }
}