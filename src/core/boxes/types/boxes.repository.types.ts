import { Box } from '../entities';
import { CreateProductDto } from '../../products/dto';

export namespace IBoxesRepository {
  export namespace Create {
    export type Params = Pick<Box, 'label'> & {
      products: CreateProductDto.Body[];
    };

    export type ReturnType = Promise<Box>;
  }
}
