import { BaseView } from '@/utils/utils';
import { IFullProduct } from '@/types';
import { IEvents } from '@/components/base/events';
import { CDN_URL } from '@/utils/constants';
import { Logger } from '@/utils/logger';

/**
 * Представление карточки товара.
 * Отвечает за рендер и взаимодействие с пользователем.
 */
export class ProductView extends BaseView {
	private events: IEvents;

	/**
	 * @param {IEvents} events - Интерфейс событийного взаимодействия.
	 * @throws {Error} Если шаблон #card-preview не найден в DOM.
	 */
	constructor(events: IEvents) {
		const template =
			document.querySelector<HTMLTemplateElement>('#card-preview');
		if (!template) throw new Error('Шаблон #card-preview не найден');
		super(template, CDN_URL);

		this.events = events;
	}

	/**
	 * Отрисовывает карточку товара на основе переданных данных.
	 * @param {IFullProduct & { hasCart: boolean }} product - Полные данные товара с флагом наличия в корзине.
	 * @returns {HTMLElement} HTML-элемент карточки товара.
	 */
	public render(product: IFullProduct & { hasCart: boolean }): HTMLElement {
		const card = this.cloneTemplate();

		this.qs(card, '.card__category')!.textContent = product.category;
		this.qs(card, '.card__title')!.textContent = product.title;
		this.qs(card, '.card__text')!.textContent = product.description;
		this.setImage(this.qs(card, '.card__image'), product.image, product.title);
		this.qs(card, '.card__price')!.textContent = this.formatPrice(
			product.price
		);

		const button = this.qs(card, '.card__button') as HTMLButtonElement;

		if (product.price === null) {
			button.disabled = true;
			button.textContent = 'Временно недоступно к покупке';
		} else {
			this.updateButton(button, product.hasCart);

			this.bindEvents(button, {
				click: () => {
					product.hasCart = !product.hasCart;

					Logger.info(
						`Товар ${product.hasCart ? 'добавлен в' : 'удалён из'} корзину`,
						product
					);

					this.events.emit(
						product.hasCart ? 'cart:add' : 'cart:remove',
						product.hasCart ? { product } : { productId: product.id }
					);

					this.updateButton(button, product.hasCart);
				},
			});
		}

		return card;
	}

	/**
	 * Обновляет текст кнопки в зависимости от состояния товара в корзине.
	 * @param {HTMLButtonElement} button - Кнопка для обновления.
	 * @param {boolean} hasCart - Признак, находится ли товар в корзине.
	 */
	private updateButton(button: HTMLButtonElement, hasCart: boolean) {
		button.textContent = hasCart ? 'Убрать' : 'В корзину';
	}
}
