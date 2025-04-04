import type { IBaseProduct, ICompletedOrder, IOrderBuilder } from '@/types';
import { Logger } from '@/services/logger';

/**
 * Модель заказа.
 * Позволяет поэтапно накапливать данные заказа и собрать структуру для отправки.
 */
export class Order implements IOrderBuilder {
	private items: string[] = [];
	private total = 0;
	private address?: string;
	private payment?: string;
	private email?: string;
	private phone?: string;

	/**
	 * Устанавливает содержимое корзины и общую сумму.
	 * @param {IBaseProduct[]} products - Список товаров
	 * @param {number} total - Итоговая сумма заказа
	 */
	setCart(products: IBaseProduct[], total: number): void {
		this.items = products.map((p) => p.id);
		this.total = total;
		Logger.info('Корзина установлена в заказ', {
			items: this.items.length,
			total,
		});
	}

	/**
	 * Устанавливает адрес доставки.
	 * @param {string} address - Адрес доставки
	 */
	setAddress(address: string): void {
		this.address = address;
		Logger.info('Адрес доставки установлен', { address });
	}

	/**
	 * Устанавливает способ оплаты.
	 * @param {string} method - Способ оплаты
	 */
	setPaymentMethod(method: string): void {
		this.payment = method;
		Logger.info('Способ оплаты установлен', { method });
	}

	/**
	 * Устанавливает контактные данные покупателя.
	 * @param {string} email - Email покупателя
	 * @param {string} phone - Телефон покупателя
	 */
	setContacts(email: string, phone: string): void {
		this.email = email;
		this.phone = phone;
		Logger.info('Контактные данные установлены');
	}

	/**
	 * Проверяет, собраны ли все обязательные поля для оформления заказа.
	 * @returns {boolean} true, если заказ готов к отправке
	 */
	isComplete(): boolean {
		return Boolean(
			this.items.length &&
				this.total > 0 &&
				this.address &&
				this.payment &&
				this.email &&
				this.phone
		);
	}

	/**
	 * Возвращает собранный заказ.
	 * @throws {Error} Если данные заказа не полны
	 * @returns {ICompletedOrder} Объект завершённого заказа
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
			payment: this.payment!,
			email: this.email!,
			phone: this.phone!,
		};
	}

	/**
	 * Сбрасывает все данные заказа.
	 */
	reset(): void {
		this.items = [];
		this.total = 0;
		this.address = undefined;
		this.payment = undefined;
		this.email = undefined;
		this.phone = undefined;
		Logger.info('Данные заказа сброшены');
	}
}
