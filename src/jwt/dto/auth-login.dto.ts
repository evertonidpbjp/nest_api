import { IsEmail, IsString, Length, MinLength } from "class-validator";

// trata autenticação: login e senha
export class AuthLoginDto{
    
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(6)
    password: string;

}