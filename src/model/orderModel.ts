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
	public setPayment(data: { payment: string; address: string }): boolean {
		if (!this.validatePayment(data)) {
			Logger.warn('Невалидные платёжные данные', data);
			return false;
		}
		this.payment = data.payment.trim();
		this.address = data.address.trim();
		Logger.info('Данные оплаты установлены', data);
		return true;
	}

	/**
	 * Устанавливает контактные данные с валидацией.
	 * @returns true — если данные валидны и установлены, иначе false.
	 */
	public setContacts(email: string, phone: string): boolean {
		if (!this.validateContacts(email, phone)) {
			Logger.warn('Невалидные контактные данные', { email, phone });
			return false;
		}
		this.email = email.trim();
		this.phone = phone.trim();
		Logger.info('Контактные данные установлены', { email, phone });
		return true;
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

	/** 
	 * Валидирует контактные данные, без изменения модели 
	 **/
	public validateContacts(email: string, phone: string): boolean {
		return Boolean(email.trim() && phone.trim());
	}

	/** 
	 * Валидирует платёжные данные, без изменения модели 
	 **/
	public validatePayment(data: { payment: string; address: string }): boolean {
		return Boolean(data.payment.trim() && data.address.trim());
	}
}
