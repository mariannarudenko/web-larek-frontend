import type { ICartItem } from './cart';

/**
 * Интерфейс базового заказа.
 * Используется на промежуточных этапах оформления — до ввода контактных данных.
 */
export interface IOrder {
	/** Список товаров в заказе */
	readonly items: ICartItem[];

	/** Общая сумма заказа */
	readonly total: number;
}

/**
 * Интерфейс завершённого (полного) заказа.
 * Наследует базовый заказ и добавляет обязательные контактные данные.
 */
export interface ICompletedOrder extends IOrder {
	/** Адрес доставки */
	readonly address: string;

	/** Способ оплаты */
	readonly paymentMethod: string;

	/** Email покупателя */
	readonly email: string;

	/** Телефон покупателя */
	readonly phone: string;
}
