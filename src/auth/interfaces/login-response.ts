import { Auth } from "../entities/auth.entity";

export interface LoginResponse{
    auth: Auth
    token:String
}