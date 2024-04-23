import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthModule } from './jwt/auth.module';
import { Throttle, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'

  // todo módulo novo criado no sistema deve ser importado aqui
@Module({
  imports: [
    ThrottlerModule.forRoot([{ // módulo q controla a quantidade de tentativas de acesso
      ttl: 60000,   // nesse caso ele permite apenas 10 tentativas em 60 segundos ( o valor é dado em milissegundos)
      limit: 10,
  //    ignoreUserAgents: [/googlebot/gi] // no caso de seu site ser indexado pelo google, vc pode liberar para q o bot acesse mais de 10 vezes
    }]),
    forwardRef(() => UserModule), //forward ref evita a depência cílica
    forwardRef(() => AuthModule),
    MailerModule.forRoot({ // módulo de envio e-mail
     // indica por qual servidor de e-mail será enviado (vem depois do @) + o usuário de email (vem antes dos dois pontos) + senha do usuário q enviará (fica entre os dois pontos e o @)
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
        user: 'isabel.witting@ethereal.email',
        pass: 'gSwsMPyvbgMSu6DjQE'
    }
      },  
      defaults: {
        from: '"Email Test" <isabel.witting@ethereal.email>', // como vai aparecer o remetente, um título e o endereço de e-mail
                                                    // aqui posso adicionar outros atributos de e-mail como CC, BCC, atachements 
      },                                     
      template: {
        dir: __dirname + '../../src/templates', // onde ele buscará os htmls dos templates engines.O _dirname indica a pasta atual, onde está q a pasta templates (mesma hierarquia do app.module.ts))
        adapter: new PugAdapter(), // qual template engine será usado (no caso, o pug)
        options: {
          strict: true,
        },
      },
    }),
  ], 
  
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule {

}
