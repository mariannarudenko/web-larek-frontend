import { BaseView } from '../base/baseView';
import { IFullProduct } from '@/types';
import { IEvents } from '@/components/base/events';
import { CDN_URL } from '@/utils/constants';
import { Logger } from '@/services/logger';

/**
 * Представление карточки товара.
 * Отвечает за рендеринг карточки товара и взаимодействие с пользователем.
 */
export class ProductView extends BaseView {
	private events: IEvents;
	private button?: HTMLButtonElement;

	/**
	 * @param {IEvents} events - Сервис событий для взаимодействия с внешним кодом
	 * @throws {Error} Если шаблон карточки товара не найден
	 */
	constructor(events: IEvents) {
		const template =
			document.querySelector<HTMLTemplateElement>('#card-preview');
		if (!template) throw new Error('Шаблон #card-preview не найден');
		super(template, CDN_URL);

		this.events = events;
	}

	/**
	 * Отрисовывает карточку товара.
	 * @param {IFullProduct & { hasCart: boolean }} product - Продукт с флагом наличия в корзине
	 * @returns {HTMLElement} DOM-элемент карточки товара
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

		this.button = this.qs(card, '.card__button') as HTMLButtonElement;

		if (product.price === null) {
			this.button.disabled = true;
			this.button.textContent = 'Временно недоступно к покупке';
		} else {
			this.updateButton(product.hasCart);

			this.button.onclick = () => {
				product.hasCart = !product.hasCart;

				Logger.info(
					`Товар ${product.hasCart ? 'добавлен в' : 'удалён из'} корзину`,
					product
				);

				this.events.emit(
					product.hasCart ? 'cart:add' : 'cart:remove',
					product.hasCart ? { product } : { productId: product.id }
				);

				this.updateButton(product.hasCart);
			};
		}

		return card;
	}

	/**
	 * Обновляет текст кнопки в зависимости от наличия товара в корзине.
	 * @param {boolean} hasCart - Флаг, указывающий, находится ли товар в корзине
	 */
	public updateButton(hasCart: boolean): void {
		if (!this.button) return;
		this.button.textContent = hasCart ? 'Убрать' : 'В корзину';
		Logger.info('Состояние кнопки обновлено', {
			text: this.button.textContent,
		});
	}
}
