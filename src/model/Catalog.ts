import { Product } from "./product";
import { ProductValidation } from "../presenter/productValidation";

/**
 * Интерфейс каталога продуктов.
 * Определяет метод получения списка продуктов.
 */
export interface IProductCatalog {
  /**
   * Возвращает список продуктов.
   * @returns {Promise<Product[]>} Промис с массивом продуктов.
   */
  getProducts(): Promise<Product[]>;
}

/**
 * Интерфейс фильтруемого каталога.
 * Определяет метод получения продукта по ID.
 */
export interface IFilterableCatalog {
  /**
   * Возвращает продукт по его идентификатору.
   * @param {string} id - Идентификатор продукта.
   * @returns {Product | undefined} Найденный продукт или undefined, если не найден.
   */
  getProductById(id: string): Product | undefined;
}

/**
 * Класс каталога продуктов.
 * Реализует хранение, фильтрацию и доступ к товарам.
 */
export class Catalog implements IProductCatalog, IFilterableCatalog {
  /** Список товаров в каталоге */
  private products: Product[] = [];

  /**
   * Возвращает список всех продуктов.
   * @returns {Promise<Product[]>} Промис с массивом продуктов.
   */
  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  /**
   * Устанавливает список продуктов после валидации.
   * @param {Product[]} products - Массив продуктов.
   */
  setProducts(products: Product[]): void {
    this.products = products.filter(ProductValidation.validate);
  }

  /**
   * Возвращает продукт по его идентификатору.
   * @param {string} id - Идентификатор продукта.
   * @returns {Product | undefined} Найденный продукт или undefined.
   */
  getProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  /**
   * Возвращает все валидные продукты.
   * @returns {Product[]} Массив всех продуктов.
   */
  getAll(): Product[] {
    return this.products;
  }
}