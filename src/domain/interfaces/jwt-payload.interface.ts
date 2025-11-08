
export interface AuthPayload  {
    id: string
    email:string
    role:string
    iat?:number
    exp?:number
}

export interface ResetPayload {
    id: string;
    iat?: number;
    exp?: number;
}