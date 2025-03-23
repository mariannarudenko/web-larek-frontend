import { IBaseProduct } from "./Product";

export interface ICartItem {
  product: IBaseProduct;
}

export class Cart {
  private items: ICartItem[] = [];

  getItems(): ICartItem[] {
    return this.items;
  }

  addItem(product: IBaseProduct): void {
    this.items.push({ product });
  }

  clear(): void {
    this.items = [];
  }
}