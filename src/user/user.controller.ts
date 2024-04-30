import { Body, Controller, Get, Post, Param, Put, Patch, Delete, ParseIntPipe, UseInterceptors, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePutUserDto } from "./dto/update-put-user.dto";
import { UpdatePatchUserDto } from "./dto/update-patch-user.dto";
import { UserService } from "./user.service";
import { LogInterceptor } from "../interceptors/log.interceptor";
import { ParamId } from "../decorators/param_id.decorator";
import { Roles } from "../decorators/roles.decorator";
import {Role} from '../enums/role.enum'
import { RoleGuard } from "../guards/role-guard";
import { AuthGuard } from "../guards/auth-guard";
import { SkipThrottle, Throttle, ThrottlerGuard } from "@nestjs/throttler";

// rota base http://localhost:3000/users
@UseInterceptors(LogInterceptor)// se quiser q interceptador seja executado para todos os métodos do controller
@UseGuards(AuthGuard, RoleGuard) // guarda q verifica os decorator Roles p/ saber se o usário tem perfil de acesso p/ cada rota, o AhtGuard deve vir antes do RoleGaurd
@Controller('users')
export class UserController{

  constructor(private readonly user: UserService) {}
  // http://localhost:3000/users
  // faz um post, a variável @body extrai do corpo da requisição passado via form url encoded, no retorno ele exibe o que foi enviado 
  @UseInterceptors(LogInterceptor) // interceptador q calcula o tempo de execução do post
  @Roles(Role.Admin) // role enum + decorator roles q protege a rota: somente usuários admin podem acessar a rota.
  @SkipThrottle() // ignora as regras globais de limite de acesso
  @Post()
  async create(@Body() {name, email, password, birthAt, role}: CreateUserDto){ // posso indicar cada campo separadamente ou usar somente body
     return await this.user.create({name, email, password, birthAt, role})
  }

  // acessa um usuário pelo id:  // http://localhost:3000/users/id e retorna um objeto user vazio e o parâmetro id
  @Roles(Role.Admin) 
  @Get(':id')
  async show(@ParamId() id: number) { // @ParamId() é um decorator personalizado q já faz a conversão do id de string p/ number.
    return await this.user.show(id);
  }
  //lista todos os usuários, rota http://localhost:3000/users
  @Roles(Role.Admin, Role.User) 
 
  @Get()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async list() {
    console.log(process.env)
    return await this.user.list();
  }

  // atualiza, passando todos os dados no corpo + o id na url - http://localhost:3000/users/id
  @Roles(Role.Admin)
  @Put(':id')
  async update(@Body() {name, email, password, birthAt, role}: UpdatePutUserDto, @Param('id', ParseIntPipe) id: number) {
    return await this.user.update(id, {name, email, password, birthAt, role} )
  }
 
 // atualiza passando o id  na url + apenas o dado q deseja modificar no corpo - http://localhost:3000/users/id
 @Roles(Role.Admin)
 @Patch(':id')
  async updatePartial(@Body() body: UpdatePatchUserDto, @Param('id', ParseIntPipe) id: number) {
    return await this.user.updatePartial(id, body)
  }
 
 
  // delete os dados, passando apens o id via url: rota http://localhost:3000/users/id
  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe ) id: number) {
    return await this.user.delete(id)

  } 

}