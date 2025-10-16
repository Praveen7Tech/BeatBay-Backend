import { IOtpService } from "../../../domain/services/otp.service";

export class OtpService implements IOtpService {
    async generate(): Promise<string> {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        return otp
    }
}