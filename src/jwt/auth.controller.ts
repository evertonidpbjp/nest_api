import { Controller, Post, Body, Headers, Req, UseGuards, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator} from "@nestjs/common";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "./auth.service";
import { AuthRegisterDto } from "./dto/auth.register.dto";
import { AuthForgetDto } from "./dto/auth-forget.dto";
import { AuthResetDto } from "./dto/auth-reset.dto";
import { AuthCheckDto } from "./dto/auth-check.dto";
import { AuthGuard } from "src/guards/auth-guard";
import { User } from "src/decorators/user.decorator";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { FileService } from "src/file/file.service";


@Controller('auth')
export class AuthController {

    constructor(
        private readonly auth: AuthService,
        private readonly fileService: FileService
    ) {}

   // método que faz autenticação, informando e-mail e senha
    @Post('login') 
    async login (@Body() {email, password}: AuthLoginDto){
      return await this.auth.login(email, password);
    }

    // cadastra usuário para que possa fazer login
    @Post('register')
    async register(@Body() body: AuthRegisterDto) {
        return await this.auth.register(body);
    }

    // método para quem esqueceu a senha e precisa recuperar, informando o e-mail cadastrado
    @Post('forget')
    async forget(@Body() {email}: AuthForgetDto) {
        return await this.auth.forget(email)
    }

    // acessa pelo link enviado pelo e-mail, valida o token e redefine a nova senha
    @Post('reset') 
    async reset (@Body() {password, tokenJwt}: AuthResetDto) {
        return await this.auth.reset(password, tokenJwt)
    }

    @UseInterceptors(FileInterceptor('file')) // interceptor interno do multer q trata arquivos de upload, entre parênteses, o 'file' é o nome do campo do input
    @UseGuards(AuthGuard) // guard q exige q usuário esteja autenticado
    @Post('photo')
    async  uploadPhoto(@User() user, 
       @UploadedFile(new ParseFilePipe({ // inicia o pipe de validação do upload
        validators: [
            new FileTypeValidator({fileType: 'image/jpeg' }), // FileTypeValidator = valida o tipo de arquivo, no caso, só aceita .jpeg
            new MaxFileSizeValidator({maxSize: 1024 * 10})    // MaxFileSizeValidator = valida o tamanho em Kbyetes, no caso o máximo é 10 KB
        ]
       })) photo: Express.Multer.File) { //@uploadFile é o decorator q intercepta a requisição do upload e armazena na variável photo
         
        
        // caminho de diretórios onde a photo será armzenada, usa o join do módulo path do express, ele sobe 2 níveis depois entra em storage/photo e salva o arquivo com o
         // nome do id do usuário somado com a extensão .png. O tipo recebido deve ser do tipo Express.Multer.File
        const path = join(__dirname,'..','..','src','storage', 'photo', `${user.id}.png`);
             console.log(path)
        try{
            // se for usar um storage externo, é essa linha q deve ser mudada
            this.fileService.upload(path, photo) // chama a função contida no FileService q faz o upload
        }
        catch(e) {
            throw new BadRequestException(e)
        }
        
        return {sucess: true}
      
    }

  // primeira forma de receber o upload de múltiplos arquivos, provindos de um input único
    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('files')
    uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[] ){
        return files
    }

     
    // fazendo upload de múltiplos arquivos (segundo método, melhor usado)
     @UseInterceptors(FileFieldsInterceptor([ // cada objeto dentro do array é um input diferente
        {
            name: 'photo',    // esse input é do name 'photo' e permite enviar até um arquivo
            maxCount: 1
        }, 
        {
            name: 'documents', // esse input de name 'documents' e permite enviar até 10 arquivos no mesmo input
            maxCount: 10
        }
     ])) 
     @UseGuards(AuthGuard)
     @Post('multiple')//dentro do objeto files, vc passa dois atributos, q representam os inputs, o primeiro recebe um Express.Multer.File normal, e o seguno um array de arquivos
     async uploadMultiplesFiles(@User() user, @UploadedFiles() files: {photo: Express.Multer.File, documents: Express.Multer.File[]}) {
        return files;
     }


    @UseGuards(AuthGuard)  // ativa o guard q verifica se a requisição possui um token válido 
    @Post('checkToken')
    async checkToken(@User() user) { // o decorator personalizado @user já disponiliza os dados do usuário p/ a rota, porém precisa q AuthGaurd seja usado também,   
         return {user}
    }



    /* verifica se o token fornecido é válido, retornando os dados do usuário 
    (sem usar o decorator personalizado e pegando os dados do usuário pelo decorator @Req)
    @UseGuards(AuthGuard) // pode passar vários guards separados por vírgula; esse guard
    @Post('checkToken') 
    async checkToken(@Req() req) {
        return {me: "ok", data: req.tokenPayload}
    }
    */

    /*verifica se o token fornecido é válido, retornando os dados do usuário (sem usar decorator nem o guard)
    @Post('checkToken')
    async checkToken(@Headers('authorization') token ) {
      return await this.auth.checkToken(token.split(' ')[1])
    } 
   */



}