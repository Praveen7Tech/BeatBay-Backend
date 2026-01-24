export interface CheckoutSessionResponse {
    id: string;
    url: string | null;
}

export interface IStripeService{
    createCheckoutSession(userId:string, email:string, priceId:string):Promise<CheckoutSessionResponse>
}