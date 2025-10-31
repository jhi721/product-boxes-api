import { Product } from '../entities';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { Box } from '../../boxes/entities';
import { FindOptionsOrderValue } from 'typeorm/find-options/FindOptionsOrder';

export namespace IProductRepository {
  export namespace Create {
    export type Params = Pick<Product, 'name' | 'barcode'>;

    export type ReturnType = Promise<Product>;
  }

  export namespace GetMany {
    export type Params = {
      filter: FindOptionsWhere<Box>;
      options: {
        limit: number;
        offset: number;
        order: Partial<Record<keyof Box, FindOptionsOrderValue>>;
      };
    };

    export type ReturnType = Promise<{ data: Box[]; total: number }>;
  }

  export namespace GetOne {
    export type Params = { id: string };

    export type ReturnType = Promise<Box | null>;
  }

  export namespace UpdateOne {
    export type Params = { id: string; data: DeepPartial<Box> };

    export type ReturnType = Promise<Box | null>;
  }

  export namespace AddProducts {
    export type Params = {
      id: string;
      productIds: string[];
    };

    export type ReturnType = Promise<Box | null>;
  }

  export namespace DeleteOne {
    export type Params = { id: string };
  }
}
