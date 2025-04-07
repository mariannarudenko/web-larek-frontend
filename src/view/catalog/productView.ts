import { ensureElement } from '@/utils/utils';
import { BaseView } from '../base/baseView';
import { IFullProduct } from '@/types';
import { CDN_URL } from '@/utils/constants';
import { Logger } from '@/services/logger';

/**
 * Представление карточки товара.
 * Отвечает за отображение детальной информации о товаре и добавление/удаление из корзины.
 */
export class ProductView extends BaseView {
	private button?: HTMLButtonElement;
	private onToggleCallback: (id: string, inCart: boolean) => void = () => {};

	/**
	 * Создаёт экземпляр ProductView.
	 * @param events Сервис событий для взаимодействия с внешним кодом.
	 */
	constructor() {
		const template = ensureElement<HTMLTemplateElement>('#card-preview');
		super(template, CDN_URL);
	}

	/**
	 * Отображает подробную карточку выбранного товара.
	 * @param product - Объект товара с флагом наличия в корзине.
	 * @returns DOM-элемент карточки.
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

				this.updateButton(product.hasCart);
				this.onToggleCallback(product.id, product.hasCart);
			};
		}

		return card;
	}

	/**
	 * Обновляет текст кнопки действия в зависимости от наличия товара в корзине.
	 * @param hasCart - Признак того, находится ли товар в корзине.
	 */
	public updateButton(hasCart: boolean): void {
		if (!this.button) return;
		this.button.textContent = hasCart ? 'Убрать' : 'В корзину';
		Logger.info('Состояние кнопки обновлено', {
			text: this.button.textContent,
		});
	}

	/**
	 * Устанавливает колбэк при клике по кнопке "В корзину" / "Убрать".
	 */
	public setOnToggle(cb: (id: string, inCart: boolean) => void): void {
		this.onToggleCallback = cb;
	}
}
