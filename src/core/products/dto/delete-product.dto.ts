import { IsUUID } from 'class-validator';

export namespace DeleteProductDto {
  export class Params {
    @IsUUID()
    id: string;
  }
}
