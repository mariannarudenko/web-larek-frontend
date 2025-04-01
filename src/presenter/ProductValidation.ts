import { IBaseProduct } from '@/types';

/**
 * Класс для валидации продуктов.
 * Содержит методы проверки корректности данных товара.
 */
export class ProductValidation {
	/**
	 * Проверяет, соответствует ли продукт требованиям:
	 * - Заголовок не пустой.
	 * - Цена либо `null` (бесценно), либо больше нуля.
	 *
	 * @param {IBaseProduct} product - Продукт для проверки.
	 * @returns {boolean} `true`, если продукт валиден, иначе `false`.
	 */
	static validate(product: IBaseProduct): boolean {
		const hasValidTitle = product.title.trim().length > 0;
		const hasValidPrice = product.price === null || product.price > 0;

		return hasValidTitle && hasValidPrice;
	}
}
