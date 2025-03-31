import type { IBaseProduct, ICartItem } from '@/types';

/**
 * Класс, представляющий корзину покупателя.
 * Позволяет добавлять и удалять товары, очищать корзину и получать текущие позиции.
 */
export class Cart {
	/** Список товаров в корзине */
	private items: ICartItem[] = [];

	/**
	 * Возвращает список всех товаров в корзине.
	 * @returns {ICartItem[]} Массив элементов корзины.
	 */
	getItems(): ICartItem[] {
		return this.items;
	}

	/**
	 * Проверяет, есть ли товар с заданным id в корзине.
	 * @param {string} id - ID товара.
	 * @returns {boolean}
	 */
	hasItem(id: string): boolean {
		return this.items.some((item) => item.product.id === id);
	}

	/**
	 * Добавляет товар в корзину, если его там ещё нет.
	 * @param {IBaseProduct} product - Товар, который нужно добавить.
	 */
	addItem(product: IBaseProduct): void {
		if (!this.hasItem(product.id)) {
			this.items.push({ product });
		}
	}

	/**
	 * Удаляет товар по id.
	 * @param {string} id - ID товара для удаления.
	 */
	removeItem(id: string): void {
		this.items = this.items.filter((item) => item.product.id !== id);
	}

	/**
	 * Очищает все товары из корзины.
	 */
	clear(): void {
		this.items = [];
	}

	/**
	 * Подсчитывает общее количество товаров.
	 * @returns {number}
	 */
	getTotalCount(): number {
		return this.items.length;
	}

	/**
	 * Подсчитывает итоговую сумму.
	 * @returns {number}
	 */
	getTotalPrice(): number {
		return this.items.reduce((sum, item) => sum + (item.product.price ?? 0), 0);
	}
}
