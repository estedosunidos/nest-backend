import { IsEmail, IsNumber, IsString, MinLength, isEmail } from "class-validator";

export class CreateAuthDto {
    @IsEmail()
    email: string;
    @MinLength(6)
    password: string;
    @IsString()
    name: string;
}