/**
 * Базовый интерфейс продукта.
 * Содержит общие свойства всех товаров.
 */
export interface IBaseProduct {
	/** Уникальный идентификатор продукта */
	id: string;

	/** Название продукта */
	title: string;

	/** Цена продукта. Может быть null, если цена не указана (бесценно) */
	price: number | null;
}

/**
 * Интерфейс продукта в каталоге.
 * Расширяет базовый продукт, добавляя категорию и изображение.
 */
export interface ICatalogProduct extends IBaseProduct {
	/** Категория, к которой относится продукт */
	category: string;

	/** URL изображения продукта */
	image: string;
}

/**
 * Полный интерфейс продукта.
 * Расширяет продукт из каталога, добавляя описание.
 */
export interface IFullProduct extends ICatalogProduct {
	/** Подробное описание продукта */
	description: string;
}
