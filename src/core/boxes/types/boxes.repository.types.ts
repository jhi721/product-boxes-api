import { Box } from '../entities';

export namespace IBoxesRepository {
  export namespace Create {
    export type Params = Pick<Box, 'label' | 'products'>;

    export type ReturnType = Promise<Box>;
  }
}
