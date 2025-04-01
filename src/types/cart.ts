import type { IBaseProduct } from './product';

/**
 * Интерфейс элемента корзины.
 * Содержит информацию о товаре, добавленном в корзину.
 */
export interface ICartItem {
	/** Товар, добавленный в корзину */
	product: IBaseProduct;
}
