import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserController } from "./user.controller";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "./user.service";
import { CheckIdMiddleware } from "src/middlewares/check.id.middleware";

@Module({
    imports: [CreateUserDto, PrismaModule],
    controllers: [UserController],
    providers: [UserService],
    exports: []

})
// para usar middlewares é preciso implementar NestModule
export class UserModule implements NestModule{
  
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CheckIdMiddleware)  // aqui pode passar vários middlewares em sequência, separando seus nomes por vírgulas
        .forRoutes({                       // forRoutes determina quais rotas serão interceptadas, também
            path: 'users/:id',             // indica que as rotas começadas por /users:id serão interceptadas
            method: RequestMethod.ALL     // all indica q todas os tipos de operações serão intercpetados: get, post, put etc
        });
    }
} 