import type { IOrderBuilder, ICompletedOrder } from '@/types';
import { Logger } from '@/services/logger';

/**
 * Класс для построения и хранения данных заказа.
 * Реализует интерфейс IOrderBuilder.
 */
export class Order implements IOrderBuilder {
	private address?: string;
	private payment?: string;
	private email?: string;
	private phone?: string;

	/**
	 * Устанавливает способ оплаты и адрес доставки.
	 * @param data Объект с полями `payment` и `address`.
	 */
	public setPayment(data: { payment: string; address: string }): void {
		this.payment = data.payment;
		this.address = data.address;
		Logger.info('Данные оплаты установлены', data);
	}

	/**
	 * Устанавливает контактные данные покупателя.
	 * @param email Адрес электронной почты.
	 * @param phone Номер телефона.
	 */
	public setContacts(email: string, phone: string): void {
		this.email = email;
		this.phone = phone;
		Logger.info('Контактные данные установлены', { email, phone });
	}

	/**
	 * Проверяет, заполнены ли все обязательные поля заказа.
	 * @returns `true`, если все данные заполнены, иначе `false`.
	 */
	public isComplete(): boolean {
		return Boolean(this.address && this.payment && this.email && this.phone);
	}

	/**
	 * Возвращает данные заказа, если они полностью заполнены.
	 * Генерирует ошибку, если данные неполные.
	 * @returns Объект с данными заказа, без `items` и `total`.
	 * @throws Ошибка, если данные заказа не полны.
	 */
	public getData(): Omit<ICompletedOrder, 'items' | 'total'> {
		if (!this.isComplete()) {
			const error = new Error('Данные заказа не полны');
			Logger.error(error.message, error);
			throw error;
		}

		return {
			address: this.address!,
			payment: this.payment!,
			email: this.email!,
			phone: this.phone!,
		};
	}

	/**
	 * Сбрасывает все данные заказа.
	 */
	public reset(): void {
		this.address = undefined;
		this.payment = undefined;
		this.email = undefined;
		this.phone = undefined;
		Logger.info('Данные заказа сброшены');
	}
}
