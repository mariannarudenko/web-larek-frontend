import { Product } from '../model/productModel';

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
