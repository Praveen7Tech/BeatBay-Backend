
import { PaymentHistoryDTO } from "../../../application/dto/premium/payment-history.dto";
import { IGetPaymentHistoryUseCase } from "../../../application/interfaces/usecase/premium/getPaymentHistory-usecase.interface";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IInvoiceHistoryRepository } from "../../../domain/repositories/invoice.Historyrepository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";

export class GetPaymentHistoryUseCase implements IGetPaymentHistoryUseCase {
    constructor(
        private readonly _stripeService: IStripeService,
        private readonly _userRepository: IUserRepository,
        private readonly _invoiceRepository: IInvoiceHistoryRepository
    ) {}

    async execute(userId: string): Promise<PaymentHistoryDTO[]> {
        const user = await this._userRepository.findById(userId);
        
        if (!user) throw new NotFoundError("user not found!")

        const invoices = await this._invoiceRepository.getPaymentHistory(userId)

        return invoices.map(inv => ({
            id: inv.stripeInvoiceId,
            date: inv.paidAt,
            amount: inv.amount,      
            currency: inv.currency.toUpperCase(),
            status: inv.status,
            description: inv.description,
            receiptUrl: inv.hostedInvoiceUrl
        }));
    }
}