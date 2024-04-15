import { Body, Controller, Get, Post, Param, Put, Patch, Delete, ParseIntPipe, UseInterceptors } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePutUserDto } from "./dto/update-put-user.dto";
import { UpdatePatchUserDto } from "./dto/update-patch-user.dto";
import { UserService } from "./user.service";
import { LogInterceptor } from "src/interceptors/log.interceptor";
// rota base http://localhost:3000/users
@UseInterceptors(LogInterceptor)// se quiser q interceptador seja executado para todos os métodos do controller
@Controller('users')
export class UserController{

  constructor(private readonly user: UserService) {}
  // http://localhost:3000/users
  // faz um post, a variável @body extrai do corpo da requisição passado via form url encoded, no retorno ele exibe o que foi enviado 
 @UseInterceptors(LogInterceptor) // interceptador q calcula o tempo de execução do post
  @Post()
  async create(@Body() {name, email, password, birthAt}: CreateUserDto){ // posso indicar cada campo separadamente ou usar somente body
     return await this.user.create({name, email, password, birthAt})
  }

  // acessa um usuário pelo id:  // http://localhost:3000/users/id e retorna um objeto user vazio e o parâmetro id
  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    return await this.user.show(id);
  }
  //lista todos os usuários, rota http://localhost:3000/users
  @Get()
  async list() {
    return await this.user.list();
  }

  // atualiza, passando todos os dados no corpo + o id na url - http://localhost:3000/users/id
  @Put(':id')
  async update(@Body() {name, email, password, birthAt}: UpdatePutUserDto, @Param('id', ParseIntPipe) id: number) {
    return await this.user.update(id, {name, email, password, birthAt} )
  }
 
 // atualiza passando o id  na url + apenas o dado q deseja modificar no corpo - http://localhost:3000/users/id
 @Patch(':id')
  async updatePartial(@Body() body: UpdatePatchUserDto, @Param('id', ParseIntPipe) id: number) {
    return await this.user.updatePartial(id, body)
  }
 
 
  // delete os dados, passando apens o id via url: rota http://localhost:3000/users/id
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe ) id: number) {
    return await this.user.delete(id)


  } 

}