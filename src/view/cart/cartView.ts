import { BaseView } from '../base/baseView';
import { ensureElement } from '@/utils/utils';
import { Logger } from '@/services/logger';
import { Cart } from '@/model/cartModel';
import { CartItemView } from './cartItemView';
import { EventEmitter } from '@/components/base/events';
import { ModalManager } from '../base/modalManager';

/**
 * Представление корзины.
 */
export class CartView extends BaseView {
	private element: HTMLElement;
	private listEl: HTMLElement;
	private totalEl: HTMLElement;
	private checkoutBtn: HTMLButtonElement;
	private itemTemplate: HTMLTemplateElement;

	/**
	 * Создает экземпляр CartView.
	 * @param eventBus - Шина событий для взаимодействия компонентов.
	 * @param modalManager - Менеджер модальных окон.
	 * @param cart - Модель корзины.
	 */
	constructor(
		private eventBus: EventEmitter,
		private modalManager: ModalManager,
		private cart: Cart
	) {
		const template = ensureElement<HTMLTemplateElement>('#basket');
		super(template, '');

		const fragment = this.cloneTemplate();
		this.element = fragment.firstElementChild as HTMLElement;

		this.listEl = ensureElement<HTMLElement>(
			this.element.querySelector('.basket__list') as HTMLElement
		);
		this.totalEl = ensureElement<HTMLElement>(
			this.element.querySelector('.basket__price') as HTMLElement
		);
		this.checkoutBtn = ensureElement<HTMLButtonElement>(
			this.element.querySelector('.basket__button') as HTMLButtonElement
		);
		this.itemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

		this.checkoutBtn.addEventListener('click', () => {
			this.eventBus.emit('order:openPayment');
		});

		this.eventBus.on('cart:open', () => {
			this.renderCartContents();
			this.modalManager.setContent(this.render());
			this.modalManager.show();
		});
	}

	/**
	 * Возвращает шаблон элемента корзины.
	 * @returns HTML-шаблон элемента корзины.
	 */
	public getItemTemplate(): HTMLTemplateElement {
		return this.itemTemplate;
	}

	/**
	 * Возвращает DOM-элемент представления корзины.
	 * @returns DOM-элемент корзины.
	 */
	public render(): HTMLElement {
		return this.element;
	}

	/**
	 * Устанавливает список элементов в представление корзины.
	 * @param items - Массив DOM-элементов товаров.
	 */
	public setItems(items: HTMLElement[]): void {
		this.listEl.innerHTML = '';
		items.forEach((el) => {
			this.listEl.appendChild(el);
		});
	}

	/**
	 * Устанавливает итоговую сумму в корзине и активирует/деактивирует кнопку оформления.
	 * @param total - Общая стоимость товаров.
	 */
	public setTotal(total: number): void {
		this.totalEl.textContent = `${total} синапсов`;
		this.checkoutBtn.disabled = total === 0;
	}

	/**
	 * Отрисовывает содержимое корзины на основе текущей модели.
	 */
	private renderCartContents(): void {
		const items = this.cart.getItems();
		const total = this.cart.getTotalPrice();

		const views = items.map((item, index) => {
			const view = new CartItemView(this.itemTemplate, item, index, (id) => {
				Logger.info('Удаление товара из корзины (UI)', { id });
				this.cart.removeItem(id);
				this.eventBus.emit('cart:changed');
			});
			return view.render();
		});

		this.setItems(views);
		this.setTotal(total);
	}

	/**
	 * Обновляет представление корзины, перерисовывая содержимое и пересчитывая итог.
	 */
	public update(): void {
		const items = this.cart.getItems();
		const total = this.cart.getTotalPrice();

		const views = items.map((item, index) => {
			const view = new CartItemView(this.itemTemplate, item, index, (id) => {
				Logger.info('Удаление товара из корзины (UI)', { id });
				this.cart.removeItem(id);
				this.eventBus.emit('cart:changed');
			});
			return view.render();
		});

		this.setItems(views);
		this.setTotal(total);
	}
}
