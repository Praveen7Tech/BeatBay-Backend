import { PaymentHistoryDTO } from "../../../dto/premium/payment-history.dto";

export interface IGetPaymentHistoryUseCase{
    execute(userId: string): Promise<PaymentHistoryDTO[]>
}