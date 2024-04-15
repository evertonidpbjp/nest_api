import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export class LogInterceptor implements NestInterceptor {
  
  // método principal q deve ser implementado
    intercept(context: ExecutionContext, next: CallHandler)  : Observable <any> {
        const dt = Date.now()

        return next.handle().pipe(tap (() => {
            const request = context.switchToHttp().getRequest(); // obtém os dados da url

            console.log(`URL: ${request.url}`) // imprime a url da requisição
            console.log(`METHOD: ${request.method}`) // imprime o método da requisição: get, post, put etc
            console.log(`Execução levou ${Date.now() - dt} milissegundos `);
        }))
    }

}