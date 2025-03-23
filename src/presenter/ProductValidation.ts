import { IBaseProduct } from "../model/Product";

export class ProductValidation {
  static validate(product: IBaseProduct): boolean {
    const hasValidTitle = product.title.trim().length > 0;
    const hasValidPrice = product.price === null || product.price > 0;

    return hasValidTitle && hasValidPrice;
  }
}