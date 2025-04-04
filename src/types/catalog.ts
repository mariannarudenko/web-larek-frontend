import { IFullProduct } from './product';

/**
 * Интерфейс каталога продуктов.
 * Определяет метод получения списка продуктов.
 */
export interface IProductCatalog {
	/**
	 * Возвращает список продуктов.
	 * @returns {IFullProduct[] | Promise<IFullProduct[]>} Массив продуктов или промис, возвращающий массив продуктов
	 */
	getProducts(): IFullProduct[] | Promise<IFullProduct[]>;
}

/**
 * Интерфейс фильтруемого каталога.
 * Определяет метод получения продукта по ID.
 */
export interface IFilterableCatalog {
	/**
	 * Возвращает продукт по его идентификатору.
	 * @param {string} id - Идентификатор продукта
	 * @returns {IFullProduct | undefined} Найденный продукт или undefined, если не найден
	 */
	getProductById(id: string): IFullProduct | undefined;
}
