import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TimeoutError } from "rxjs";
import { ROLES_KEY } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";

@Injectable()
export class RoleGuard implements CanActivate {
   
    //reflector é um recurso do nest q permite acessar o decorator p/ saber quais rotas estão protegidas
    constructor( private readonly reflector: Reflector) {}

    // método obrigatório de todo guard
   async canActivate(context: ExecutionContext){
     // o getallAndOverride recebe a lista de roles do enum no parâmetro ROLES_KEY (essa constante está definida no decorator roles.decorator)
     // o context.getHandler e context.geClass informa q o guard poderá ser aplicado tanto nos métodos individualmente e tb na classe do controler como um todo
     // ele retorna a role requerida p/ determinada rota
     const requeridRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]) 
 
     /* essa linha não funcionou
       if(!requeridRoles) {
        return true
       }  
       */

     // extrai os dados do usuário da requisição
     const {user} = context.switchToHttp().getRequest();
     // varre o array de roles, se alguma dela for igual ao role do usuário, ele retorna para o filtro q se for maior q zero ele retorna true
      const rolesFilter = requeridRoles.filter((role) => role === user.role); 
      
      console.log("role" + rolesFilter)
      
      return rolesFilter.length > 0 
     
    }   
}



      
