import { Api, ApiListResponse } from '@/components/base/api';
import { API_ENDPOINTS } from '@/utils/constants';
import { Product } from '@/model/productModel';
import { Catalog } from '@/model/catalogModel';
import { IProductCatalog, IFilterableCatalog } from '@/types';
import { ProductValidation } from '@/utils/productValidation';
import { Logger } from '@/utils/logger';

/**
 * Класс, реализующий интерфейсы каталога и фильтрации товаров.
 * Загружает данные с API, валидирует и сохраняет продукты в локальном каталоге.
 */
export class CatalogApi implements IProductCatalog, IFilterableCatalog {
	private catalog = new Catalog();
	private api = new Api(process.env.API_ORIGIN);

	/**
	 * Загружает список продуктов с сервера, валидирует их и сохраняет.
	 * @returns Промис с массивом валидных продуктов.
	 */
	async getProducts(): Promise<Product[]> {
		try {
			const response = await this.api.get(API_ENDPOINTS.PRODUCTS);
			const rawProducts = (response as ApiListResponse<Product>).items.map(
				(p) =>
					new Product(
						p.id,
						p.title,
						p.description,
						p.price,
						p.category,
						p.image
					)
			);

			const validProducts = rawProducts.filter(ProductValidation.validate);
			this.catalog.setProducts(validProducts);

			Logger.info('Продукты успешно загружены и валидированы', validProducts);
			return this.catalog.getAll();
		} catch (error) {
			Logger.error('Ошибка при загрузке продуктов', error);
			return [];
		}
	}

	/**
	 * Возвращает продукт по его ID из локального каталога.
	 * @param id Идентификатор продукта.
	 * @returns Найденный продукт или undefined.
	 */
	getProductById(id: string): Product | undefined {
		const product = this.catalog.getProductById(id);
		if (product) {
			Logger.info('Продукт получен по ID', product);
		} else {
			Logger.warn('Продукт не найден', { id });
		}
		return product;
	}
}
