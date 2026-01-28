
import { PaymentHistoryDTO } from "../../../application/dto/premium/payment-history.dto";
import { IGetPaymentHistoryUseCase } from "../../../application/interfaces/usecase/premium/getPaymentHistory-usecase.interface";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";

export class GetPaymentHistoryUseCase implements IGetPaymentHistoryUseCase {
    constructor(
        private readonly _stripeService: IStripeService,
        private readonly _userRepository: IUserRepository 
    ) {}

    async execute(userId: string): Promise<PaymentHistoryDTO[]> {
        const user = await this._userRepository.findById(userId);
        
        if (!user || !user.stripeCustomerId) {
            return [];
        }

        const invoices = await this._stripeService.getPaymentHistory(user.stripeCustomerId);

        return invoices.map(inv => ({
            id: inv.id,
            date: new Date(inv.created * 1000), 
            amount: inv.amount_paid / 100,      
            currency: inv.currency.toUpperCase(),
            status: inv.status || 'unknown',
            receiptUrl: inv.hosted_invoice_url || ''
        }));
    }
}