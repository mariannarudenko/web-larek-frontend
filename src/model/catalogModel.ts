import { Product } from './productModel';
import { ProductValidation } from '@/presenter/productValidation';
import type { IProductCatalog, IFilterableCatalog } from '@/types';
import { Logger } from '@/utils/logger';

/**
 * Класс каталога продуктов.
 * Реализует хранение, фильтрацию и доступ к товарам.
 */
export class Catalog implements IProductCatalog, IFilterableCatalog {
	private products: Product[] = [];

	/**
	 * Возвращает список всех продуктов.
	 * @returns Промис с массивом продуктов.
	 */
	async getProducts(): Promise<Product[]> {
		return this.products;
	}

	/**
	 * Устанавливает список продуктов после валидации.
	 * @param products Массив продуктов.
	 */
	setProducts(products: Product[]): void {
		this.products = products.filter(ProductValidation.validate);
		Logger.info('Каталог обновлён', {
			total: products.length,
			valid: this.products.length,
		});
	}

	/**
	 * Возвращает продукт по его ID.
	 * @param id Идентификатор продукта.
	 * @returns Найденный продукт или undefined.
	 */
	getProductById(id: string): Product | undefined {
		const product = this.products.find((product) => product.id === id);
		if (product) {
			Logger.info('Продукт найден в каталоге', product);
		} else {
			Logger.warn('Продукт не найден в каталоге', { id });
		}
		return product;
	}

	/**
	 * Возвращает все продукты из каталога.
	 * @returns Массив продуктов.
	 */
	getAll(): Product[] {
		return this.products;
	}
}
