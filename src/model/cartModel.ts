import type { IBaseProduct, ICartItem } from '@/types';
import { Logger } from '@/services/logger';
import { EVENTS } from '@/utils/constants';
import type { EventEmitter } from '@/components/base/events';

/**
 * Класс, представляющий корзину покупателя.
 * Позволяет управлять товарами: добавлять, удалять, очищать и получать информацию.
 */
export class Cart {
	private items: ICartItem[] = [];
	private eventBus?: EventEmitter;

	constructor(eventBus?: EventEmitter) {
		this.eventBus = eventBus;
	}
	
	/**
	 * Возвращает все товары в корзине.
	 * @returns {ICartItem[]} Массив товаров в корзине
	 */
	getItems(): ICartItem[] {
		return this.items;
	}

	/**
	 * Проверяет наличие товара в корзине по его ID.
	 * @param {string} id - Идентификатор товара
	 * @returns {boolean} true, если товар найден
	 */
	hasItem(id: string): boolean {
		return this.items.some((item) => item.product.id === id);
	}

	/**
	 * Добавляет товар в корзину, если его там ещё нет.
	 * @param {IBaseProduct} product - Товар для добавления
	 */
	addItem(product: IBaseProduct): void {
		if (!this.hasItem(product.id)) {
			this.items.push({ product });
			Logger.info(`Товар добавлен в корзину: ${product.title}`, product);
		} else {
			Logger.warn(
				`Попытка повторного добавления товара: ${product.title}`,
				product
			);
		}
	}

	/**
	 * Удаляет товар из корзины по его ID.
	 * @param {string} id - Идентификатор товара
	 */
	removeItem(id: string): void {
		const initialLength = this.items.length;
		this.items = this.items.filter((item) => item.product.id !== id);

		if (this.items.length < initialLength) {
			Logger.info(`Товар удалён из корзины: ${id}`);
		} else {
			Logger.warn(`Попытка удалить несуществующий товар: ${id}`);
		}
	}

	/**
	 * Очищает корзину.
	 */
	clear(): void {
		this.items = [];
		Logger.info('Корзина очищена');
		this.eventBus?.emit(EVENTS.CART_CHANGED);
	}

	/**
	 * Возвращает общее количество товаров в корзине.
	 * @returns {number} Количество товаров
	 */
	getTotalCount(): number {
		return this.items.length;
	}

	/**
	 * Возвращает общую сумму всех товаров в корзине.
	 * @returns {number} Общая стоимость товаров
	 */
	getTotalPrice(): number {
		return this.items.reduce((sum, item) => sum + (item.product.price ?? 0), 0);
	}
}
