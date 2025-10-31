import { Box } from '../entities';
import { CreateProductDto } from '../../products/dto';
import { DeepPartial, EntityManager, FindOptionsWhere } from 'typeorm';
import { Product } from '../../products/entities';
import { FindOptionsOrderValue } from 'typeorm/find-options/FindOptionsOrder';

export namespace IBoxesRepository {
  export namespace Create {
    export type Params = Pick<Box, 'label'> & {
      products: CreateProductDto.Body[];
    };

    export type ReturnType = Promise<Box>;
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

  export namespace RemoveProducts {
    export type Params = {
      id: string;
      productIds: string[];
    };

    export type ReturnType = Promise<Box | null>;
  }

  export namespace _AssignProductsToBox {
    export type Params = {
      entityManager: EntityManager;
      box: Box | null;
      products: Product[];
    };
  }
}
