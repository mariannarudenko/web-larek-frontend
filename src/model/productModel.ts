import type { IFullProduct } from '@/types';

/**
 * Класс, представляющий полный продукт.
 * Реализует интерфейс IFullProduct и содержит все свойства товара.
 */
export class Product implements IFullProduct {
	/**
	 * Создаёт новый экземпляр продукта.
	 * @param {string} id - Уникальный идентификатор.
	 * @param {string} title - Название продукта.
	 * @param {string} description - Описание продукта.
	 * @param {number | null} price - Цена продукта.
	 * @param {string} category - Категория продукта.
	 * @param {string} image - URL изображения продукта.
	 */
	constructor(
		public readonly id: string,
		public readonly title: string,
		public readonly description: string,
		public readonly price: number | null,
		public readonly category: string,
		public readonly image: string
	) {}
}
