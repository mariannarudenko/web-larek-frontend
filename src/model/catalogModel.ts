import type {
	IFullProduct,
	IProductCatalog,
	IFilterableCatalog,
} from '@/types';
import { Logger } from '@/services/logger';

/**
 * Класс каталога продуктов.
 * Реализует хранение и поиск продуктов.
 */
export class Catalog implements IProductCatalog, IFilterableCatalog {
	private products: IFullProduct[] = [];

	/**
	 * Возвращает все продукты из каталога.
	 * @returns {IFullProduct[]} Массив продуктов
	 */
	getProducts(): IFullProduct[] {
		return this.products;
	}

	/**
	 * Заменяет текущие продукты новыми.
	 * @param {IFullProduct[]} products - Новый массив продуктов
	 */
	setProducts(products: IFullProduct[]): void {
		this.products = products;

		Logger.info('Каталог обновлён', {
			total: products.length,
		});
	}

	/**
	 * Ищет продукт по его ID.
	 * @param {string} id - Идентификатор продукта
	 * @returns {IFullProduct | undefined} Найденный продукт или undefined
	 */
	getProductById(id: string): IFullProduct | undefined {
		const product = this.products.find((product) => product.id === id);

		if (product) {
			Logger.info('Продукт найден в каталоге', product);
		} else {
			Logger.warn('Продукт не найден в каталоге', { id });
		}

		return product;
	}
}
