import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthRegisterDto } from "./dto/auth.register.dto";
import { FileModule } from "src/file/file.module";

@Module({
    imports: [AuthRegisterDto, JwtModule.register({
        secret: process.env.JWT_SECRET // senha secret q será usada para critprgafar o token (ela aponta p/ a constante q está definida no .env)
    }), 
     PrismaModule,
     forwardRef( () => UserModule), // só é necessário informar se for usar os métodos do UserService e quiser evitar a dependência cílica
     FileModule
  ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService, AuthRegisterDto]
    
})
export class AuthModule{


}