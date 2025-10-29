import { IsUUID } from 'class-validator';
import { BoxDto } from './models';

export namespace RemoveProductsDto {
  export class Params {
    @IsUUID()
    id: string;
  }

  export class Query {
    @IsUUID('all', { each: true })
    productIds: string[];
  }

  export type Response = Promise<{
    data: BoxDto | null;
  }>;
}
