import { ExecutionContext, NotFoundException, createParamDecorator } from "@nestjs/common";

// esse decorator serve apenas para disponibilizar os dados do usuário extraindo da requisição
// p/ funcionar é preciso ser usado juntamente com o guard (q é o responsável por validar o token, acessar o BD e obter os dados do usuário) 
export const User = createParamDecorator((filter: string, context: ExecutionContext)  => {
    const request = context.switchToHttp().getRequest();
    
    if(request.user) { // testa se os dados do usuário estão presentes na requisição
        
        if(filter) {  // verifica se foi passado algum filtro p/ retornar um dado específico do usuário, p.ex name, email etc
            
           return  request.user['filter']; 
        
        } 
          else {
          
            return request.user;
        }

    } else {
         // se ñ houver dados do usuário na requisição é pq o AuthGaurd não foi usado, então ele retorna uma exceção, pedindo p/ usá-lo
     throw new NotFoundException('Usuário não encontrado no Request. Use o User Guard' )
    }

});