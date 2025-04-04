import { ICartItem } from '@/types';
import { cloneTemplate, setElementData } from '@/utils/utils';

/**
 * Представление отдельного элемента корзины.
 * Отвечает за генерацию HTML-разметки на основе шаблона и данных товара.
 */
export class CartItemView {
	/**
	 * @param {HTMLTemplateElement} template - Шаблон элемента корзины
	 * @param {ICartItem} item - Товар в корзине
	 * @param {number} index - Порядковый номер товара
	 */
	constructor(
		private template: HTMLTemplateElement,
		private item: ICartItem,
		private index: number
	) {}

	/**
	 * Генерирует и возвращает DOM-элемент для отображения товара в корзине.
	 * @returns {HTMLElement} HTML-элемент представления товара
	 */
	render(): HTMLElement {
		const node = cloneTemplate<HTMLElement>(this.template);
		setElementData(node, { id: this.item.product.id });

		node.querySelector('.basket__item-index')!.textContent = `${
			this.index + 1
		}`;
		node.querySelector('.card__title')!.textContent = this.item.product.title;
		node.querySelector('.card__price')!.textContent = `${
			this.item.product.price ?? 'Бесценно'
		} синапсов`;

		return node;
	}
}
