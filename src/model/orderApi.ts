import { Api } from '../components/base/api';
import { API_ENDPOINTS } from '@/utils/constants';
import { ICompletedOrder } from '@/types';
import { Logger } from '@/services/logger';

/**
 * Класс для отправки заказа на сервер.
 */
export class OrderApi {
	private api = new Api(process.env.API_ORIGIN);

	/**
	 * Отправляет заказ на сервер.
	 * @param {ICompletedOrder} order - Объект завершённого заказа
	 * @returns {Promise<object>} Промис с ответом от сервера
	 * @throws {unknown} Если произошла ошибка при отправке
	 */
	async sendOrder(order: ICompletedOrder): Promise<object> {
		if (!order || Object.keys(order).length === 0) {
			Logger.warn('Попытка отправки пустого заказа', order);
		}

		try {
			const response = await this.api.post(API_ENDPOINTS.ORDER, order);
			Logger.info('Заказ успешно отправлен', response);
			return response;
		} catch (error) {
			Logger.error('Ошибка при отправке заказа', error);
			throw error;
		}
	}
}
