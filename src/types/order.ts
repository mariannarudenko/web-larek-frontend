import type { ICartItem } from './cart';

/**
 * Интерфейс заказа с базовой информацией.
 * Используется внутри модели на этапе, когда заказ ещё не завершён.
 */
export interface IOrderDraft {
	items: string[]; // только id товаров
	total: number;
	address?: string;
	payment?: string;
	email?: string;
	phone?: string;
}

/**
 * Завершённый заказ, готовый к отправке.
 * Используется для API и отправки на сервер.
 */
export interface ICompletedOrder {
	items: string[];
	total: number;
	address: string;
	payment: string;
	email: string;
	phone: string;
}

/**
 * Интерфейс билдера для сборки заказа поэтапно.
 */
export interface IOrderBuilder {
	setCart(items: ICartItem[], total: number): void;
	setAddress(address: string): void;
	setPaymentMethod(method: string): void;
	setContacts(email: string, phone: string): void;
	isComplete(): boolean;
	getData(): ICompletedOrder;
	reset(): void;
}

/**
 * Отправщик заказа — абстракция для любого сервиса, который умеет отправлять заказ.
 */
export interface IOrderSender {
	sendOrder(order: ICompletedOrder): Promise<object>;
}
