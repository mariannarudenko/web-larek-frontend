import type { IBaseProduct } from './product';

/**
 * Черновик заказа.
 * Используется внутри модели на этапе, когда заказ ещё не завершён.
 */
export interface IOrderDraft {
	/**
	 * Идентификаторы товаров в заказе
	 */
	items: string[];

	/**
	 * Общая сумма заказа
	 */
	total: number;

	/**
	 * Адрес доставки (опционально)
	 */
	address?: string;

	/**
	 * Способ оплаты (опционально)
	 */
	payment?: string;

	/**
	 * Email покупателя (опционально)
	 */
	email?: string;

	/**
	 * Телефон покупателя (опционально)
	 */
	phone?: string;
}

/**
 * Завершённый заказ, готовый к отправке.
 * Используется для API и передачи на сервер.
 */
export interface ICompletedOrder {
	/**
	 * Идентификаторы товаров в заказе
	 */
	items: string[];

	/**
	 * Общая сумма заказа
	 */
	total: number;

	/**
	 * Адрес доставки
	 */
	address: string;

	/**
	 * Способ оплаты
	 */
	payment: string;

	/**
	 * Email покупателя
	 */
	email: string;

	/**
	 * Телефон покупателя
	 */
	phone: string;
}

/**
 * Интерфейс поэтапного сборщика заказа.
 */
export interface IOrderBuilder {
	/**
	 * Устанавливает содержимое корзины и общую сумму.
	 * @param products - Список товаров
	 * @param total - Общая сумма
	 */
	setCart(products: IBaseProduct[], total: number): void;

	/**
	 * Устанавливает адрес доставки.
	 * @param address - Адрес
	 */
	setAddress(address: string): void;

	/**
	 * Устанавливает способ оплаты.
	 * @param method - Способ оплаты
	 */
	setPaymentMethod(method: string): void;

	/**
	 * Устанавливает контактные данные.
	 * @param email - Email
	 * @param phone - Телефон
	 */
	setContacts(email: string, phone: string): void;

	/**
	 * Проверяет, готов ли заказ к отправке.
	 * @returns true, если заказ заполнен полностью
	 */
	isComplete(): boolean;

	/**
	 * Возвращает собранный заказ.
	 * @returns Завершённый заказ
	 */
	getData(): ICompletedOrder;

	/**
	 * Сбрасывает все данные заказа.
	 */
	reset(): void;
}

/**
 * Абстракция отправки заказа.
 * Подходит для любого сервиса, который умеет отправлять заказ.
 */
export interface IOrderSender {
	/**
	 * Отправляет заказ.
	 * @param order - Завершённый заказ
	 * @returns Промис с ответом от сервера
	 */
	sendOrder(order: ICompletedOrder): Promise<object>;
}
