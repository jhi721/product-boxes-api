import { IsUUID } from 'class-validator';

export namespace DeleteBoxDto {
  export class Params {
    @IsUUID()
    id: string;
  }
}
