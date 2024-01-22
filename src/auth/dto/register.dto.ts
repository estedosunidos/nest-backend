import { IsEmail, IsNumber, IsString, MinLength, isEmail } from "class-validator";

export class ReGISTERAuthDto {
    _id?: string;
    @IsEmail()
    email: string;
    @MinLength(6)
    password: string;
    @IsString()
    name: string;
}