import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './interceptors/log.interceptor';




async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   
  // habilita cors p/ permitir comunicação entre aplicações front ou back end q rodam em domínios diferentes
  // só precisa configurar isso se o front e o back rodarem em dominionos diferentes
  app.enableCors({
    origin: ['site.com.br', 'site.lab.com.br', '*'], // o asterisco indica q ele aceita requisições de qq domínio
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] // define quais métodos serão aceitos p/ fazer a requisição
  })

  app.useGlobalPipes(new ValidationPipe());

  // app.useGlobalInterceptors(new LogInterceptor) // habilita o interceptor de forma global

  
  await app.listen(3000);
  
}
bootstrap();
