import { createParamDecorator, ExecutionContext} from "@nestjs/common";

// cria um decorator q terá o nome da constante e será aplicado no controller acima da rota do método assim: @ParamId()
export const ParamId = createParamDecorator((_data: unknown, context: ExecutionContext) => {
     
    return Number(context.switchToHttp().getRequest().params.id) // recupera o id da requisição e converte de string p/ número por meio do Number

});

