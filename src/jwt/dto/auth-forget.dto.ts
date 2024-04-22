import { IsEmail } from "class-validator";

// gera link para reset da senha
export class AuthForgetDto {
   
    @IsEmail()  
    email: string
}