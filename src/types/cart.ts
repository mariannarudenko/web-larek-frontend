import type { IBaseProduct } from './product';

/**
 * Интерфейс элемента корзины.
 * Представляет товар, добавленный в корзину.
 */
export interface ICartItem {
	/**
	 * Товар, добавленный в корзину
	 */
	product: IBaseProduct;
}
