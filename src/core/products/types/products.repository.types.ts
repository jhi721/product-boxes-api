import { Product } from '../entities';

export namespace IProductRepository {
  export namespace Create {
    export type Params = Pick<Product, 'name' | 'barcode'>;

    export type ReturnType = Promise<Product>;
  }
}
