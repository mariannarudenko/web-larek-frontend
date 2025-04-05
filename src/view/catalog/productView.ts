import { BaseView } from '../base/baseView';
import { IFullProduct } from '@/types';
import { IEvents } from '@/components/base/events';
import { CDN_URL } from '@/utils/constants';
import { Logger } from '@/services/logger';
import { ModalManager } from '@/view/base/modalManager';
import { ProductModel } from '@/model/productModel';
import { Cart } from '@/model/cartModel';

interface ProductViewProps {
	eventBus: IEvents;
	productModel: ProductModel;
	modalManager: ModalManager;
	cart: Cart;
}

/**
 * Представление карточки товара.
 * Отвечает за отображение детальной информации о товаре и добавление/удаление из корзины.
 */
export class ProductView extends BaseView {
	private events: IEvents;
	private productModel: ProductModel;
	private modalManager: ModalManager;
	private cart: Cart;
	private button?: HTMLButtonElement;

	/**
	 * Создаёт экземпляр ProductView.
	 * Подписывается на события выбора товара и изменения корзины.
	 * @param eventBus - Шина событий.
	 * @param productModel - Модель товаров.
	 * @param modalManager - Менеджер модальных окон.
	 * @param cart - Модель корзины.
	 * @throws Ошибка, если шаблон карточки товара не найден.
	 */
	constructor({
		eventBus,
		productModel,
		modalManager,
		cart,
	}: ProductViewProps) {
		const template =
			document.querySelector<HTMLTemplateElement>('#card-preview');
		if (!template) throw new Error('Шаблон #card-preview не найден');
		super(template, CDN_URL);

		this.events = eventBus;
		this.productModel = productModel;
		this.modalManager = modalManager;
		this.cart = cart;

		this.events.on<{ id: string }>('product:select', ({ id }) => {
			const product = this.productModel.getProductById(id);
			if (!product) return;

			const hasValidTitle = product.title.trim().length > 0;
			const hasValidPrice = product.price === null || product.price > 0;
			if (!hasValidTitle || !hasValidPrice) {
				Logger.warn('Невалидный продукт', product);
				return;
			}

			this.productModel.setCurrent(product);
			const hasCart = this.cart.hasItem(product.id);
			const productElement = this.render({ ...product, hasCart });
			this.modalManager.setContent(productElement);
			this.modalManager.show();
		});

		this.events.on('cart:changed', () => {
			const current = this.productModel.getCurrent();
			if (!current || !this.modalManager.isVisible()) return;
			const hasCart = this.cart.hasItem(current.id);
			this.updateButton(hasCart);
		});
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
}
