import { IsEmail, IsString, IsStrongPassword, Length,IsNotEmpty, IsOptional, IsDateString, IsEnum } from "class-validator";
import { Role } from "src/enums/role.enum";
export class CreateUserDto {
     
    @IsString()// deve ser uma string  
    @Length(3, 10) // 3-5 de tamanho
    name: string;
    
    @IsNotEmpty()
    @IsEmail({
        message: 'E-mail está no formato incorreto'
    }) // deve ser uma string no formato de e-mail
    email: string;

    @IsStrongPassword({
        minLength: 6,  // a senha terá no mínimo 6 caracteres
        minNumbers: 1, // ñ precisa ter nenhum número
        minLowercase: 1, // ñ precisa ter nenhum caractere minúsculo
        minUppercase: 1, // ñ precisa ter nenhum caractere maiúsculo
        minSymbols: 1, // ñ precisa usar nenhum símbolo especial
        
    })
    password: string;

    @IsOptional() // campo ñ obrigatório
    @IsDateString() // verifica se a string contém uma data 
    birthAt?: string;

    @IsOptional()  
   // @IsEnum(Role)  // campo deve ter um dos valores definidos no Enum Role 
    role?: number;
     
}