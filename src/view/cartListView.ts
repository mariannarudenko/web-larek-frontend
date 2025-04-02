import type { ICartItem } from '@/types';
import {
	ensureElement,
	cloneTemplate,
	setElementData,
	BaseView,
} from '@/utils/utils';
import { Logger } from '@/utils/logger';

/**
 * Представление списка товаров в корзине.
 */
export class CartListView extends BaseView {
	protected container: HTMLElement;
	protected itemTemplate: HTMLTemplateElement;

	protected removeHandler: (id: string) => void = () => {};
	protected checkoutHandler: () => void = () => {};

	/**
	 * @param container Элемент, в который будет рендериться корзина.
	 */
	constructor(container: HTMLElement) {
		const template = ensureElement<HTMLTemplateElement>('#basket');
		super(template, '');

		this.container = container;
		this.itemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
	}

	/**
	 * Отображает список товаров и итоговую сумму.
	 * @param items Список товаров.
	 * @param total Общая стоимость.
	 */
	render(items: ICartItem[], total: number): void {
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
					Logger.info('Удаление товара из корзины (UI)', {
						id: item.product.id,
					});
					this.removeHandler(item.product.id);
				});
			}

			list.appendChild(itemNode);
		});

		totalPrice.textContent = this.formatPrice(total);
		checkoutBtn.disabled = items.length === 0;
		checkoutBtn.addEventListener('click', () => {
			Logger.info('Нажатие на кнопку "Оформить заказ"');
			this.checkoutHandler();
		});

		this.container.appendChild(basketNode);

		Logger.info('Корзина отрендерена', {
			count: items.length,
			total,
		});
	}

	/**
	 * Устанавливает обработчик удаления товара.
	 * @param handler Функция, вызываемая при удалении товара.
	 */
	onRemove(handler: (id: string) => void): void {
		this.removeHandler = handler;
	}

	/**
	 * Устанавливает обработчик оформления заказа.
	 * @param handler Функция, вызываемая при оформлении заказа.
	 */
	onCheckout(handler: () => void): void {
		this.checkoutHandler = handler;
	}

	/**
	 * Обновляет счётчик товаров в шапке.
	 * @param count Количество товаров.
	 */
	updateCounter(count: number): void {
		const counter = document.querySelector('.header__basket-counter');
		if (counter) {
			counter.textContent = String(count);
		}
	}
}
