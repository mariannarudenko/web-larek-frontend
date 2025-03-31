import type { ICartItem, IOrder } from '@/types';

/**
 * Класс, представляющий заказ.
 * Хранит информацию о заказанных товарах и контактные данные.
 */
export class Order implements IOrder {
	/**
	 * Создаёт новый заказ.
	 * @param {ICartItem[]} items - Список товаров в заказе.
	 * @param {number} total - Общая сумма заказа.
	 * @param {string} [address] - Адрес доставки.
	 * @param {string} [paymentMethod] - Способ оплаты.
	 * @param {string} [email] - Email покупателя.
	 * @param {string} [phone] - Телефон покупателя.
	 */
	constructor(
		public readonly items: ICartItem[],
		public readonly total: number,
		public readonly address?: string,
		public readonly paymentMethod?: string,
		public readonly email?: string,
		public readonly phone?: string
	) {}
}
