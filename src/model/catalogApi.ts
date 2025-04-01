import { Api } from '../components/base/api';
import { Product } from '@/model/productModel';
import { Catalog } from '@/model/catalogModel';
import { ApiListResponse } from '../components/base/api';
import { IProductCatalog, IFilterableCatalog } from '@/types';
import { ProductValidation } from '@/presenter/productValidation';
import { Logger } from '@/utils/logger';

/**
 * Класс, реализующий интерфейсы каталога и фильтрации товаров.
 * Отвечает за загрузку данных с API и хранение валидных продуктов в локальном каталоге.
 */
export class CatalogApi implements IProductCatalog, IFilterableCatalog {
	/** Локальный каталог продуктов */
	private catalog = new Catalog();

	/** Клиент для запросов к API */
	private api = new Api(
		process.env.API_ORIGIN || 'https://larek-api.nomoreparties.co'
	);

	/**
	 * Загружает список продуктов с сервера, валидирует и сохраняет их.
	 * @returns {Promise<Product[]>} Промис с массивом валидных продуктов.
	 */
	async getProducts(): Promise<Product[]> {
		try {
			const response = (await this.api.get(
				'/api/weblarek/product/'
			)) as ApiListResponse<Product>;
			const rawProducts = response.items.map(
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
	 * Возвращает продукт по ID из локального каталога.
	 * @param {string} id - Идентификатор продукта.
	 * @returns {Product | undefined} Найденный продукт или undefined.
	 */
	getProductById(id: string): Product | undefined {
		const product = this.catalog.getProductById(id);
		if (!product) {
			Logger.warn('Продукт не найден', { id });
		}
		return product;
	}
}
