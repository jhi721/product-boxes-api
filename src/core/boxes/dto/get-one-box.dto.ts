import { IsUUID } from 'class-validator';
import { BoxDto } from './models';

export namespace GetOneBoxDto {
  export class Params {
    @IsUUID()
    id: string;
  }

  export type Response = Promise<{
    data: BoxDto | null;
  }>;
}
