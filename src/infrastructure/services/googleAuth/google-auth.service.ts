import { OAuth2Client } from "google-auth-library";
import { IGoogleAuthService } from "../../../domain/services/google-auth.service";

export class GoogleAuthService implements IGoogleAuthService {
    private client: OAuth2Client;
    //private clientId: string

    constructor(private _clientId: string) {   
    this.client = new OAuth2Client(this._clientId);
  }

    async verifyToken(token: string) {
        const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this._clientId,
        });

        const payload = ticket.getPayload();
        if (!payload) throw new Error("Invalid Google token");
        return payload;
    }
}
