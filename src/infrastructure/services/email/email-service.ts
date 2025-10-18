import nodemailer from 'nodemailer'
import { IEmailService } from '../../../domain/services/mail.service';

export class EmailService implements IEmailService {
    private transporter;

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure:true,
            auth:{
                user:process.env.SMTP_MAIL,
                pass:process.env.SMTP_PASS,
            },
        })
    }

    async sendMail(email: string, subject: string, text: string, html?: string): Promise<void> {
        await this.transporter.sendMail({
            from:`Beat Bay ${process.env.SMTP_MAIL}`,
            to:email,
            subject,
            text,
            html
        })
    }
}