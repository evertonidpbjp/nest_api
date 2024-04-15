import { BadRequestException, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

// middleware q intercepta requisição e verifica se o id fornecido é um número ou se é maior q zero
export class CheckIdMiddleware implements NestMiddleware {
    use (req: Request, res: Response, next: NextFunction ) {
       
       // antes de passar pelo middleware
        if(isNaN(Number(req.params.id)) || Number(req.params.id) <= 0) { // o Number converte o id q vem no formato de string p/ numero. 
            throw new BadRequestException('ID inválido')
        }
       // depois de passar pelo middleware 
        next();  // se passar no teste, ele dá continuidade à requisição, passando para o controller

    }
}