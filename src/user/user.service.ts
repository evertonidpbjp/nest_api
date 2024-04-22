import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePutUserDto } from "./dto/update-put-user.dto";
import { UpdatePatchUserDto } from "./dto/update-patch-user.dto";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService{
    
    constructor(private readonly prisma: PrismaService) {}
    // método q salva os dados enviados via post (registro usuario no BD)
   async create({name, email, password, birthAt, role}: CreateUserDto){
       
    const salt = await bcrypt.genSalt() // gera o salt p/ tornar a senha mais segura
    password = await bcrypt.hash(password, salt) // aplica o hash na senha
    
    return await this.prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password,
                birthAt: birthAt? new Date(birthAt) : "",
                role: role
            },

            select: {
                id: true
            }
        })
    }

  // método q lista todos os usuários do BD
    async list(){
        return await this.prisma.user.findMany();

  }

  // método q obtém apenas o usuário referente ao id informado.
  async show(id: number): Promise<User>{
    
    await this.exists(id) 
    
    return await this.prisma.user.findUnique({
        where: {
            id: id
        }
     })

}
// atualiza todos os campos
async update(id: number, {name, email, password, birthAt, role}: UpdatePutUserDto) {
    
    await this.exists(id);

    const salt = await bcrypt.genSalt() // gera o salt p/ tornar a senha mais segura
    password = await bcrypt.hash(password, salt) // aplica o hash na senha

    return await this.prisma.user.update({
        data: {name, email, password, birthAt: birthAt ? new Date(birthAt) : null, role}, // se o birthAt não for informado ele recebe null
        where: {
           id: id
        }
   });
  } 



// atualiza apenas os campos informados, os demais ficam intactos no BD
async updatePartial(id: number, {name, email, password, birthAt, role}: UpdatePatchUserDto) {
    
    await this.exists(id);
    
    if(password) { // se o password for passado, a encripta antes de salvar no BD
        const salt = await bcrypt.genSalt() // gera o salt p/ tornar a senha mais segura
        password = await bcrypt.hash(password, salt) // aplica o hash na senha
    }
    return await this.prisma.user.update({
        data: {name, email, password, birthAt, role}, // nesse caso, ñ precisa validar p birth, pois o prisma já trabalha de acordo com o updatePartial
        where: {
            id: id
        }
    })
}

//delete registros 
async delete(id: number) {
   await this.exists(id);
    
   return this.prisma.user.delete({
    where: {
        id: id
    }
   })

}



// verificar se usuário existe com o count q conta a quantidade de registros q atende ao indice. É mais rápido q o select
async exists(id: number) {
    
    if (!(await this.prisma.user.count({
        where: {
            id: id
        }
    }))){
        throw new NotFoundException(`O usuario de id = ${id} não existe`) // se não existir, retorna erro.
    }


    
}


}