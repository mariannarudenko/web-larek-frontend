import type { IBaseProduct, ICartItem } from '@/types';
import { Logger } from '@/utils/logger';

/**
 * Класс, представляющий корзину покупателя.
 * Позволяет управлять товарами: добавлять, удалять, очищать и получать информацию.
 */
export class Cart {
	private items: ICartItem[] = [];

	/**
	 * Возвращает все товары в корзине.
	 * @returns Массив элементов корзины.
	 */
	getItems(): ICartItem[] {
		return this.items;
	}

	/**
	 * Проверяет наличие товара в корзине по его ID.
	 * @param id ID товара.
	 * @returns true, если товар есть в корзине.
	 */
	hasItem(id: string): boolean {
		return this.items.some((item) => item.product.id === id);
	}

	/**
	 * Добавляет товар в корзину, если его там ещё нет.
	 * @param product Товар для добавления.
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
	 * @param id ID товара для удаления.
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
		if (this.items.length === 0) {
			Logger.warn('Попытка очистить уже пустую корзину');
		} else {
			this.items = [];
			Logger.info('Корзина очищена');
		}
	}

	/**
	 * Возвращает общее количество товаров в корзине.
	 * @returns Количество товаров.
	 */
	getTotalCount(): number {
		return this.items.length;
	}

	/**
	 * Возвращает общую сумму всех товаров в корзине.
	 * @returns Итоговая сумма.
	 */
	getTotalPrice(): number {
		return this.items.reduce((sum, item) => sum + (item.product.price ?? 0), 0);
	}
}
