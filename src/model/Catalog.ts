import { Product } from "./Product";

export interface IProductCatalog {
  setProducts(products: Product[]): void;
  getProducts(): Promise<Product[]>; 
}

export interface IFilterableCatalog {
  getProductById(id: string): Product | undefined;
}

export class Catalog implements IProductCatalog, IFilterableCatalog {
  private products: Product[] = [];

  setProducts(products: Product[]): void {
    this.products = products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  getAll(): Product[] {
    return this.products;
  }

  getProducts(): Promise<Product[]> {
    return Promise.resolve(this.products);
  }
}