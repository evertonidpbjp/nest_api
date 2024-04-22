import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDto } from "./dto/auth.register.dto";
import { User } from "@prisma/client";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService{
 
    constructor(
        
        private readonly jwt: JwtService,
        private readonly prisma: PrismaService


    ) {}

     // método q salva os dados enviados via post (registro usuario no BD)
   async register(body: AuthRegisterDto){
    console.log(`register: ${body.role}`)

    
    const salt = await bcrypt.genSalt()// gera o salt p/ tornar a senha mais segura
    body.password = await bcrypt.hash(body.password, salt) // aplica o hash na senha
    
    return await this.prisma.user.create({
         data: {
            name: body.name,
            email: body.email,
            password: body.password,
            birthAt: body.birthAt ? new Date(body.birthAt) : null,
         },

         select: {
             id: true
         }
     })
 }

   // método q cria token, é invocado pela método login ()
    async createToken(user: User) { // o prisma cria auto vários classes com o tipo das tabelas do BD, User é criado internamente no pacote prisma.client
       return {
         acessToken: await this.jwt.sign({   // método q define quais dados serão incorporados ao token gerado, posoo colocar os dados q quiser
            id: user.id,
            name: user.name,
            email: user.email // é bom evitar colocar a senha dentro do tokne
           },
            {
              expiresIn: "7 days",   // tempo q o token leva para expirar
              subject: String(user.id), // outros dados extras
              issuer: 'login',
              audience: 'users'
            })
       }
    }
  
     // verifica se o token é válido (a cada requisição precisa enviar o token) (ñ precisa usar await/async, pois ñ retorna uma promise)
    checkToken(token: string){
       try{
            const data =   this.jwt.verify(token, {
                audience: 'users',         // esses dados (audience e issuer e outros q vc pode definir) devem ser os mesmo do createToken
                issuer: 'login' 
            })
            return (data)
       } catch(err) {
         
            throw new BadRequestException(err)
       }
       
    }
    // igual ao anterior, mas em vez de retornar os dados do usuário, ele retorna true ou false ( // verifica se o token é válido (a cada requisição precisa enviar o token) (ñ precisa usar await/async, pois ñ retorna uma promise))
    isValid(token: string) {

        try{
            const data = this.jwt.verify(token, {
                audience: 'users',
                issuer: 'login'
            })
             return (data)

        }catch (err) {
            return false;
        }  
    }

    // método q faz autenticação do usuário, ao informar email e senha
   async login (email: string, password: string) {
       const user = await this.prisma.user.findFirst({ // faz consulta no BD do usuário pelo e-mail informado
        where: {
            email: email,
        }
       });
   
       // se usuário ñ existir, retorna uma execção de ñ autorizado 
       if(!user){
          throw new UnauthorizedException('Email ou senha incorretos');
       }

       // se o usuário existir, compara o password informado c/ o password encriptado do BD, se ñ "baterem" retorna uma exceção
       if(!await bcrypt.compare(password, user.password)) {
          throw new UnauthorizedException('Email ou senha incorretos')
       }

       // após autenticar ele gera o token chamando a função createToken acima.
       return this.createToken(user); 

       // pendência: implementar depois captcha ou limitar no servidor tentativas sucessivas de login inválidos

   }

   // usuário esqueceu a senha e precisa recuperar, então ele passa o e-mail. Esse método irá validar se o e-mail existe
   async forget(email: string) {
        const user = await this.prisma.user.findFirst({ // verifica se o e-mail existe
            where: {
                email: email
            }
        });

        if(!user) { // se o usuário com o e-mail informado não existir, retorna um erro
            throw new UnauthorizedException('Email inválido')
        }

        return true; // se usuário existir, retorna true e envia o link p/ e-mail cadastrado do usuário
       
        // implementar função de envio de e-mail
   }
   
   // após acessar o link, usuário precisa informar nova senha e o token enviado para o e-mail. Assim redefinirá a senha
   async reset (novaSenha: string, token: string) {
     // validar token (pendente)

    const id = 1; // aqui ficará o id do usuário extraído do token após a validação
   
    // atualiza o password com a nova senha, buscando pelo id extraído do token (o token contém o id do usuário), retorna um user
     const user = await this.prisma.user.update({
        where: {                     
            id: id 
        },
        data: {
            password: novaSenha
        }
    });
    
    // após atualizar a senha, ele já faz auto o login/autenticação, gerando o token de acess (outra opção seria redirecionar o usuário para a tela de login somente)
    return  this.createToken(user);


   }


}
