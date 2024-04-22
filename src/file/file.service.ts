import { Injectable } from "@nestjs/common";
import { writeFile } from "fs/promises";

@Injectable()
export class FileService {

 async upload(path: string, photo: Express.Multer.File){
   // usa a função writeFile do express para escrever a foto no formato de buffer no caminho especificado na variável path
   // essa função ñ retorna nada
    return await writeFile(path, photo.buffer);
 }

}