import { SetMetadata } from "@nestjs/common";
import {Role} from "../enums/role.enum";

// criação da constante apenas p/ evitar erro de escrita, ela será usada na função setMetadata abaixo e tb no RoleGuard
export const ROLES_KEY = 'roles'
// recebe um array de roles e passa p/ a função setmetadata q transforma a constante ROLES_KEY objeto q já transforma num objeto com uma propriedade dentro
//  no caso a propriedade será populada com o array roles passado como parâmetro anteriormente
export const Roles  = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles ) 
