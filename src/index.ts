import './scss/styles.scss';
import { EventEmitter } from "../components/base/events";

export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export class Product implements IProduct {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly price: number,
    public readonly category: string,
    public readonly imageUrl: string
  ) {}
}

export class ProductValidation {
  static validate(product: Product): boolean {
    if (product.price <= 0) {
      return false;
    }
    if (!product.title.trim()) {
      return false;
    }
    return true;
  }
}

class Catalog {
  private products: Product[];

  constructor() {
    this.products = []; 
  }

  addProduct(product: Product) {
      this.products.push(product);
  }


  getProducts() {
    return this.products;
  }
}

class Cart {
  private products: Product[];
  
}