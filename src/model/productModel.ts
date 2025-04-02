import type { IFullProduct } from '@/types';

/**
 * Класс, представляющий полный продукт.
 * Реализует интерфейс IFullProduct и содержит все свойства товара.
 */
export class Product implements IFullProduct {
	/**
	 * Создаёт новый экземпляр продукта.
	 * @param id Уникальный идентификатор.
	 * @param title Название продукта.
	 * @param description Описание продукта.
	 * @param price Цена продукта (может быть null).
	 * @param category Категория продукта.
	 * @param image URL изображения продукта.
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
