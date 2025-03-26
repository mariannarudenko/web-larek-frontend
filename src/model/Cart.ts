import { IBaseProduct } from "./product";

/**
 * Интерфейс элемента корзины.
 * Содержит информацию о товаре, добавленном в корзину.
 */
export interface ICartItem {
  /** Товар, добавленный в корзину */
  product: IBaseProduct;
}

/**
 * Класс, представляющий корзину покупателя.
 * Позволяет добавлять товары, очищать корзину и получать текущие позиции.
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
   * Добавляет товар в корзину.
   * @param {IBaseProduct} product - Товар, который нужно добавить.
   */
  addItem(product: IBaseProduct): void {
    this.items.push({ product });
  }

  /**
   * Очищает все товары из корзины.
   */
  clear(): void {
    this.items = [];
  }
}