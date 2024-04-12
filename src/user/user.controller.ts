import { Body, Controller, Get, Post, Param, Put, Patch, Delete } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePutUserDto } from "./dto/update-put-user.dto";
import { UpdatePatchUserDto } from "./dto/update-patch-user.dto";
// rota base http://localhost:3000/users
@Controller('users')
export class UserController{
  // http://localhost:3000/users
  // faz um post, a variável @body extrai do corpo da requisição passado via form url encoded, no retorno ele exibe o que foi enviado 
  @Post()
  async create(@Body() {name, email, password}: CreateUserDto){ // posso indicar cada campo separadamente ou usar somente body
     return {name, email, password}
  }

  // acessa um usuário pelo id:  // http://localhost:3000/users/id e retorna um objeto user vazio e o parâmetro id
  @Get(':id')
  async show(@Param() id) {
    return {user: {}, param: id}
  }

  //lista todos os usuários, rota http://localhost:3000/users
  @Get()
  async list() {
    return {users: {}}
  }

  // atualiza, passando todos os dados no corpo + o id na url - http://localhost:3000/users/id
  @Put(':id')
  async update(@Body() body: UpdatePutUserDto, @Param() id) {
    return {
        method: 'put',
        id: id,
        body: body
    }
 }
 
 // atualiza passando o id  na url + apenas o dado q deseja modificar no corpo - http://localhost:3000/users/id
 @Patch(':id')
  async updatePartial(@Body() body: UpdatePatchUserDto, @Param() id) {
    return {
        method: 'patch',
        id: id,
        body: body
    }
  }
 // delete os dados, passando apens o id via url: rota http://localhost:3000/users/id
  @Delete(':id')
  async delete(@Param() id) {
    return {
        method: 'delete',
        id: id,

    }
  } 

} 