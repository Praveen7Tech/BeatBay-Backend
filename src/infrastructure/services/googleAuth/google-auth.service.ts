import { OAuth2Client } from "google-auth-library";
import { IGoogleAuthService } from "../../../domain/services/google-auth.service";
const client_id = process.env.GOOGLE_CLIENT_ID!

export class GoogleAuthService implements IGoogleAuthService {
    private client: OAuth2Client;
    //private clientId: string

    constructor(private clientId: string) {   
    this.client = new OAuth2Client(this.clientId);
  }

    async verifyToken(token: string) {
        const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.clientId,
        });

        const payload = ticket.getPayload();
        if (!payload) throw new Error("Invalid Google token");
        return payload;
    }
}
