import { TestingModule, Test } from "@nestjs/testing";
import { UserService } from "./user.service";
import { RespositoryMock } from "../testing/respository-mock";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDtoTest } from "../testing/create-user-dto-test";
import { ListUserDtoTest } from "../testing/list-user-dto.test";
import { CreateUserDto } from "./dto/create-user.dto";
import { Prisma } from "@prisma/client";
import { AppModule } from "../app.module";


// describe indica um contexto de um conjunto de testes
describe('Testando classe User service', () => {
   
    let userService: UserService;
    let prismaService: PrismaService;
    
// tudo aquilo q precisar ser importado antes da realzação do teste fica dentro do beforeEach c/ módulos e injeções de depeneêcia
beforeEach(async () => {  
    
    // cria um módulo fake p/ pode injetar os objetos: controllers, services, repositorys etc
    const module: TestingModule = await Test.createTestingModule({
        imports: [
     //       AppModule
        ],
        providers: [
            UserService,                 //injeta o UserService
            PrismaService
          
            //  RespositoryMock            /essa linha só deve ser usada se estiver com typeORM, ela injeta a dependÊncia de UserRespository da qual User Service depende
        ]
    }).compile();

       // o get extrai de dentro do módulo fake qq recurso interno, nesse caso extraiu o UserService e guardou numa variável
       userService = module.get<UserService>(UserService);
       prismaService = module.get<PrismaService>(PrismaService);
});

   
    test('Validar se a UserService foi corretamente definido/injetado', () => {
        expect(userService).toBeDefined();
    })

    test('Validar se o PrismaService foi corretamente definido/injetado', () => {
        expect(prismaService).toBeDefined();
    })

    test('Test method: Create', async() => {
        const resultado =  await userService.create(CreateUserDtoTest)
        expect(resultado.id).toEqual(20)

    }) 

    jest.mock('@prisma/client');
    const mockPrisma = jest.mocked('@prisma/client');
    
    mockPrisma.user.findMany.mockImplementation(() => Promise.resolve(ListUserDtoTest));    
    
    
      test('Test method: List', async () => {
      

      })
   
});

/* teste simples inicial

test('Testa a soma de dois valores', () => {
    const resultado = soma(2 , 5);
    expect(resultado).toEqual(7);
})

*/