import { IsJWT } from "class-validator";

// checa se o token é válido
export class AuthCheckDto {
   
    @IsJWT()
    tokenJwt: string;
}