import type { ICartItem, ICompletedOrder, IOrderBuilder } from '@/types';
import { Logger } from '@/utils/logger';

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
	 * @param items Список товаров.
	 * @param total Итоговая сумма.
	 */
	setCart(items: ICartItem[], total: number): void {
		this.items = items.map((item) => item.product.id);
		this.total = total;
		Logger.info('Корзина установлена в заказ', {
			items: this.items.length,
			total,
		});
	}

	/**
	 * Устанавливает адрес доставки.
	 * @param address Адрес доставки.
	 */
	setAddress(address: string): void {
		this.address = address;
		Logger.info('Адрес доставки установлен');
	}

	/**
	 * Устанавливает способ оплаты.
	 * @param method Способ оплаты.
	 */
	setPaymentMethod(method: string): void {
		this.payment = method;
		Logger.info('Способ оплаты установлен', { method });
	}

	/**
	 * Устанавливает контактные данные покупателя.
	 * @param email Email.
	 * @param phone Телефон.
	 */
	setContacts(email: string, phone: string): void {
		this.email = email;
		this.phone = phone;
		Logger.info('Контактные данные установлены');
	}

	/**
	 * Проверяет, собраны ли все обязательные поля для оформления заказа.
	 * @returns true, если заказ готов к отправке.
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
	 * @throws Ошибка, если данные неполны.
	 * @returns Объект заказа.
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
