import { ICartItem } from '@/types';
import { cloneTemplate, setElementData, ensureElement } from '@/utils/utils';

/**
 * Представление отдельного элемента корзины.
 * Отвечает за генерацию HTML-разметки и обработку удаления товара.
 */
export class CartItemView {
	private element: HTMLElement;

	/**
	 * @param template HTML-шаблон элемента корзины.
	 * @param item Данные товара в корзине.
	 * @param index Порядковый номер товара.
	 * @param onDelete Колбэк при удалении товара из корзины.
	 */
	constructor(
		private template: HTMLTemplateElement,
		private item: ICartItem,
		private index: number,
		private onDelete?: (id: string) => void
	) {
		this.element = this.createElement();
	}

	/**
	 * Создаёт HTML-элемент товара на основе шаблона.
	 * @returns Сформированный HTML-элемент.
	 */
	private createElement(): HTMLElement {
		const node = cloneTemplate<HTMLElement>(this.template);
		setElementData(node, { id: this.item.product.id });

		node.querySelector('.basket__item-index')!.textContent = `${
			this.index + 1
		}`;
		node.querySelector('.card__title')!.textContent = this.item.product.title;
		node.querySelector('.card__price')!.textContent = `${
			this.item.product.price ?? 'Бесценно'
		} синапсов`;

		const deleteButton = ensureElement<HTMLButtonElement>(
			node.querySelector('.basket__item-delete') as HTMLButtonElement
		);

		deleteButton.addEventListener('click', () => {
			this.onDelete?.(this.item.product.id);
		});

		return node;
	}

	/**
	 * Возвращает HTML-элемент для отображения на странице.
	 * @returns Элемент товара в корзине.
	 */
	public render(): HTMLElement {
		return this.element;
	}
}
