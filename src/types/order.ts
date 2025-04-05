/**
 * Завершённый заказ, готовый к отправке.
 * Используется для API и передачи на сервер.
 */
export interface ICompletedOrder {
	/** Идентификаторы товаров в заказе */
	items: string[];

	/** Общая сумма заказа */
	total: number;

	/** Адрес доставки */
	address: string;

	/** Способ оплаты */
	payment: string;

	/** Электронная почта клиента */
	email: string;

	/** Номер телефона клиента */
	phone: string;
}

/**
 * Интерфейс поэтапного сборщика заказа.
 * Хранит только то, что вводит пользователь вручную.
 */
export interface IOrderBuilder {
	/**
	 * Устанавливает способ оплаты и адрес доставки.
	 * @param data Объект с полями `payment` и `address`.
	 */
	setPayment(data: { payment: string; address: string }): void;

	/**
	 * Устанавливает контактные данные пользователя.
	 * @param email Электронная почта.
	 * @param phone Телефон.
	 */
	setContacts(email: string, phone: string): void;

	/**
	 * Возвращает готовые к отправке данные заказа.
	 * Исключает список товаров и общую сумму.
	 */
	getData(): Omit<ICompletedOrder, 'items' | 'total'>;

	/**
	 * Сбрасывает все данные сборщика заказа.
	 */
	reset(): void;
}
