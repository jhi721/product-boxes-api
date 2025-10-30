import { IsArray, IsUUID } from 'class-validator';
import { BoxDto } from './models';

export namespace AddProductDto {
  export class Params {
    @IsUUID()
    id: string;
  }

  export class Body {
    @IsArray()
    @IsUUID('all', { each: true })
    productIds: string[];
  }

  export type Response = Promise<{
    data: BoxDto | null;
  }>;
}
