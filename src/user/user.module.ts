import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { CreateUserDto } from "./dto/create-user.dto";

@Module({
    imports: [CreateUserDto],
    controllers: [UserController],
    providers: [],
    exports: []

})
export class UserModule {

}