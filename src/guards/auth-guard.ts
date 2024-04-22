import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "src/jwt/auth.service";
import { UserService } from "src/user/user.service";

// intercepta cada requisição para verificar se o token enviado é válido + acessa o BD p/ obter os dados do usuário e inserir na requisição
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        
        private readonly auth: AuthService, 
        private readonly userService: UserService



    ) {}

   async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest(); // obtém os dados da requisição
        const {authorization} = request.headers; // extrai o campo atuhorization dos header, que é o campo q contém o token passado
     
        try{
        
        // checa se token é válido, então retorna os dados do usuário, mas antes precisa remover o "bearer" e o espaço, e pegar somente o token em si
         const data = this.auth.checkToken((authorization ?? '').split(' ')[1]); 
         request.tokenPayload = data;  // guarda o dentro da requisição o token obtido p/ retornar para o usuário no controller
         request.user = await this.userService.show(data.id) // extrai o id da requisição e faz um aconsulta no BD para obter todos os dados do usuário e guarda na requisição
        
         return true;

        } catch(err) {
            return false
        }
       
    }
}