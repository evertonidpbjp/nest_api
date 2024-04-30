import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';

import { UserController } from './user.controller';

describe('Teste E2E do módulo users', () => {
  let app: TestingModule;
  let userController: UserController;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  test('Recuperar usuários', () => {
    console.log('1');
    userController.create
    console.log('1');
  });

  test('Recuperar um usuário', () => {
    console.log('2');
    userController.show
    console.log('2');
  });
/*
  test('Criar usuários', async () => {
    const data = { name: '11athi', email: 'taa@com', password: '123456' };
    const result = await userController.create(data);
    console.log(result);
    expect(result).toHaveProperty('id');
    expect(result.nome).toBe(data.name); 
    expect(result.email).toBe(data.email);
    expect(result.senha).toBe(data.password);

  });
  */
});
