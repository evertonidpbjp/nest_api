import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthModule } from './jwt/auth.module';
import { Throttle, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';


  // todo módulo novo criado no sistema deve ser importado aqui
@Module({
  imports: [
    ThrottlerModule.forRoot([{ // módulo q controla a quantidade de tentativas de acesso
      ttl: 60000,   // nesse caso ele permite apenas 10 tentativas em 60 segundos (p valor é dado em milissegundos)
      limit: 10,
  //    ignoreUserAgents: [/googlebot/gi] // no caso de seu site ser indexado pelo google, vc pode liberar para q o bot acesse mais de 10 vezes
    }]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule)
  ], 
  
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule {

}
