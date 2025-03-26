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