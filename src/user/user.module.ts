import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from "@nestjs/common";
import { UserController } from "./user.controller";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "./user.service";
import { CheckIdMiddleware } from "../middlewares/check.id.middleware";
import { AuthModule } from "../jwt/auth.module";

@Module({
    imports: [CreateUserDto, PrismaModule, forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]

})
// para usar middlewares é preciso implementar NestModule
export class UserModule implements NestModule{
  
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CheckIdMiddleware)  // aqui pode passar vários middlewares em sequência, separando seus nomes por vírgulas
        .forRoutes({                       // forRoutes determina quais rotas serão interceptadas
            path: 'users/:id',             // indica que as rotas começadas por /users:id serão interceptadas
            method: RequestMethod.ALL     // all indica q todas os tipos de operações serão intercpetados: get, post, put etc
        });
    }
} 