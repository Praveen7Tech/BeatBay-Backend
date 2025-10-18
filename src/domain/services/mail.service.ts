
export interface IEmailService {
    sendMail(email: string, subject: string, text: string, html?: string): Promise<void>
}