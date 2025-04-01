import type { ICartItem, ICompletedOrder } from '@/types';
import { Logger } from '@/utils/logger';

/**
 * Модель заказа.
 * Позволяет поэтапно накапливать данные заказа и собрать полную структуру, готовую к отправке.
 */
export class Order {
	private items: ICartItem[] = [];
	private total: number = 0;
	private address?: string;
	private paymentMethod?: string;
	private email?: string;
	private phone?: string;

	/**
	 * Устанавливает корзину: товары и итоговую сумму.
	 * @param items - Список товаров
	 * @param total - Общая сумма
	 */
	setCart(items: ICartItem[], total: number) {
		this.items = items;
		this.total = total;
	}

	/**
	 * Устанавливает адрес доставки.
	 * @param address - Адрес
	 */
	setAddress(address: string) {
		this.address = address;
	}

	/**
	 * Устанавливает способ оплаты.
	 * @param method - Способ оплаты
	 */
	setPaymentMethod(method: string) {
		this.paymentMethod = method;
	}

	/**
	 * Устанавливает контактные данные.
	 * @param email - Email
	 * @param phone - Телефон
	 */
	setContacts(email: string, phone: string) {
		this.email = email;
		this.phone = phone;
	}

	/**
	 * Проверяет, собраны ли все обязательные поля для оформления заказа.
	 * @returns true, если заказ можно оформить.
	 */
	isComplete(): boolean {
		return !!(
			this.items.length &&
			this.total > 0 &&
			this.address &&
			this.paymentMethod &&
			this.email &&
			this.phone
		);
	}

	/**
	 * Возвращает собранный заказ. Выбрасывает ошибку, если данных недостаточно.
	 * @returns Полный заказ
	 */
	getData(): ICompletedOrder {
		if (!this.isComplete()) {
			const error = new Error('Данные заказа не полны');
			Logger.error(error.message, error);
			throw error;
		}

		return {
			items: this.items,
			total: this.total,
			address: this.address!,
			paymentMethod: this.paymentMethod!,
			email: this.email!,
			phone: this.phone!,
		};
	}

	/**
	 * Сброс всех данных заказа.
	 */
	reset() {
		this.items = [];
		this.total = 0;
		this.address = undefined;
		this.paymentMethod = undefined;
		this.email = undefined;
		this.phone = undefined;
	}
}
