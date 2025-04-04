import { Api, ApiListResponse } from '@/components/base/api';
import { API_ENDPOINTS } from '@/utils/constants';
import type { IFullProduct } from '@/types';
import { Logger } from '@/services/logger';

/**
 * Класс для работы с API каталога.
 * Отвечает только за загрузку данных о продуктах.
 */
export class CatalogApi {
	private api = new Api(process.env.API_ORIGIN);

	/**
	 * Загружает список продуктов с API.
	 * @returns {Promise<IFullProduct[]>} Промис, возвращающий массив продуктов или пустой массив при ошибке
	 */
	async fetchProducts(): Promise<IFullProduct[]> {
		try {
			const response = await this.api.get(API_ENDPOINTS.PRODUCTS);
			const rawProducts = (response as ApiListResponse<IFullProduct>).items;

			Logger.info('Продукты успешно загружены с API');
			return rawProducts;
		} catch (error) {
			Logger.error('Ошибка при загрузке продуктов', error);
			return [];
		}
	}
}
