import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable() // prepara classe para ser inbjetada em outras cçases (injeção de dependência)
export class PrismaService extends PrismaClient implements OnModuleInit{

    constructor(){
        super();
    }

    // cria conexão na inicialização
   async onModuleInit() {
        await this.$connect();
    }

    // fechar a conexão na finalização do componente
    enableShutdownHooks(app: INestApplication){
        process.on('beforeExit', async() =>{
            await app.close();
        } )
    }
}