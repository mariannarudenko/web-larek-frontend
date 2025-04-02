import { IBaseProduct } from '@/types';
import { Logger } from '@/utils/logger';

/**
 * Класс для валидации продуктов.
 */
export class ProductValidation {
	/**
	 * Проверяет, валиден ли продукт:
	 * - Заголовок не пустой.
	 * - Цена либо null, либо больше нуля.
	 * @param product Продукт для проверки.
	 * @returns true, если продукт валиден.
	 */
	static validate(product: IBaseProduct): boolean {
		const hasValidTitle = product.title.trim().length > 0;
		const hasValidPrice = product.price === null || product.price > 0;

		const isValid = hasValidTitle && hasValidPrice;

		if (!isValid) {
			Logger.warn('Невалидный продукт', product);
		}

		return isValid;
	}
}
