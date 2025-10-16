export interface IOtpService {
    generate() : Promise<string>;
}