import type { ICartItem } from '@/types';
import {
	ensureElement,
	cloneTemplate,
	setElementData,
	isPlainObject,
	BaseView,
} from '@/utils/utils';

/**
 * Представление списка товаров в корзине.
 */
export class CartListView extends BaseView {
	/** Элемент-контейнер, в который рендерится корзина */
	protected container: HTMLElement;

	/** Шаблон для отдельного элемента корзины */
	protected itemTemplate: HTMLTemplateElement;

	/** Обработчик удаления товара из корзины */
	protected removeHandler: (id: string) => void = () => {};

	/** Обработчик оформления заказа */
	protected checkoutHandler: () => void = () => {};

	/**
	 * Создаёт экземпляр представления корзины.
	 * @param container - DOM-элемент, куда будет рендериться корзина
	 */
	constructor(container: HTMLElement) {
		const template = ensureElement<HTMLTemplateElement>('#basket');
		super(template, '');

		this.container = container;
		this.itemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
	}

	/**
	 * Отображает список товаров в корзине.
	 * @param items - Список товаров в корзине
	 * @param total - Общая стоимость товаров
	 */
	render(items: ICartItem[], total: number) {
		this.container.innerHTML = '';

		const basketNode = this.cloneTemplate();
		const list = this.qs<HTMLElement>(basketNode, '.basket__list')!;
		const totalPrice = this.qs<HTMLElement>(basketNode, '.basket__price')!;
		const checkoutBtn = this.qs<HTMLButtonElement>(
			basketNode,
			'.basket__button'
		)!;

		items.forEach((item, index) => {
			const itemNode = cloneTemplate<HTMLElement>(this.itemTemplate);
			setElementData(itemNode, { id: item.product.id });

			this.qs(itemNode, '.basket__item-index')!.textContent = `${index + 1}`;
			this.qs(itemNode, '.card__title')!.textContent = item.product.title;
			this.qs(itemNode, '.card__price')!.textContent = this.formatPrice(
				item.product.price
			);

			const deleteButton = this.qs(itemNode, '.basket__item-delete');
			if (deleteButton) {
				deleteButton.addEventListener('click', () => {
					this.removeHandler(item.product.id);
				});
			}

			list.appendChild(itemNode);
		});

		totalPrice.textContent = this.formatPrice(total);
		checkoutBtn.disabled = items.length === 0;
		checkoutBtn.addEventListener('click', () => this.checkoutHandler());

		this.container.appendChild(basketNode);
	}

	/**
	 * Устанавливает обработчик удаления товара из корзины.
	 * @param handler - Функция-обработчик, принимающая id товара
	 */
	onRemove(handler: (id: string) => void) {
		this.removeHandler = handler;
	}

	/**
	 * Устанавливает обработчик оформления заказа.
	 * @param handler - Функция-обработчик оформления заказа
	 */
	onCheckout(handler: () => void) {
		this.checkoutHandler = handler;
	}

	/**
	 * Обновляет счётчик количества товаров в корзине в шапке.
	 * @param count - Количество товаров
	 */
	updateCounter(count: number) {
		const counter = document.querySelector('.header__basket-counter');
		if (counter) counter.textContent = String(count);
	}
}
