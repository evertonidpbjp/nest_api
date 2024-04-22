import { IsAlpha, MinLength, IsString, IsJWT } from "class-validator";


export class AuthResetDto {

    @MinLength(6)
    @IsString()
    password: string;3

    // o  token jwt pode ser usado ñ somente p/ autenticação, nesse caso p/ validar qnd o usuário for redefinir a senha ao vir do link do e-mail
    @IsJWT() 
    tokenJwt: string;

}