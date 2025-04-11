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
		this.payment = data.payment.trim();
		this.address = data.address.trim();

		if (!this.validatePayment()) {
			Logger.warn('Невалидные платёжные данные', data);
			return false;
		}
	
		Logger.info('Данные оплаты установлены', data);
		return true;
	}

	/**
	 * Устанавливает контактные данные с валидацией.
	 * @returns true — если данные валидны и установлены, иначе false.
	 */
	public setContacts(data: { email: string; phone: string }): boolean {
		this.email = data.email.trim();
		this.phone = data.phone.trim();

		if (!this.validateContacts()) {
			Logger.warn('Невалидные контактные данные', data);
			return false;
		}
		
		Logger.info('Контактные данные установлены', data);
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
	public validateContacts(): boolean {
		return Boolean(this.email?.trim() && this.phone?.trim());
	}

	/**
	 * Валидирует платёжные данные, на основе текущего состояния модели.
	 * @returns true, если данные заполнены корректно.
	 */
	public validatePayment(): boolean {
		return Boolean(this.payment?.trim() && this.address?.trim());
	}
}
