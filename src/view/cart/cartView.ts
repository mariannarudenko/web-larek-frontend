import { BaseView } from '@/view/base/baseView';
import { ensureElement } from '@/utils/utils';
import { Logger } from '@/services/logger';

/**
 * Представление корзины.
 * Отвечает за отображение списка товаров, общей суммы и обработку события оформления заказа.
 */
export class CartView extends BaseView {
	private element?: HTMLElement;
	private listEl!: HTMLElement;
	private totalEl!: HTMLElement;
	private checkoutBtn!: HTMLButtonElement;
	private onCheckoutCallback: () => void = () => {};

	/**
	 * Создаёт представление корзины на основе шаблона.
	 */
	constructor() {
		const template = ensureElement<HTMLTemplateElement>('#basket');
		super(template, '');
	}

	/**
	 * Отрисовывает представление корзины.
	 * @returns {HTMLElement} Корневой DOM-элемент корзины
	 */
	public render(): HTMLElement {
		this.element = this.cloneTemplate();

		this.listEl = ensureElement<HTMLElement>(
			this.element.querySelector('.basket__list') as HTMLElement
		);
		this.totalEl = ensureElement<HTMLElement>(
			this.element.querySelector('.basket__price') as HTMLElement
		);
		this.checkoutBtn = ensureElement<HTMLButtonElement>(
			this.element.querySelector('.basket__button') as HTMLButtonElement
		);

		this.checkoutBtn.addEventListener('click', () => {
			Logger.info('Нажатие на кнопку "Оформить заказ"');
			this.onCheckoutCallback();
		});

		return this.element;
	}

	/**
	 * Устанавливает элементы товаров в список корзины.
	 * @param {HTMLElement[]} items - Массив HTML-элементов товаров
	 */
	public setItems(items: HTMLElement[]): void {
		this.listEl.innerHTML = '';
		items.forEach((el) => this.listEl.appendChild(el));
	}

	/**
	 * Устанавливает отображение общей стоимости заказа.
	 * Также блокирует кнопку, если сумма равна нулю.
	 * @param {number} total - Общая сумма
	 */
	public setTotal(total: number): void {
		this.totalEl.textContent = `${total} синапсов`;
		this.checkoutBtn.disabled = total === 0;
	}

	/**
	 * Устанавливает обработчик события оформления заказа.
	 * @param {() => void} cb - Колбэк, вызываемый при нажатии на кнопку оформления
	 */
	public onCheckout(cb: () => void): void {
		this.onCheckoutCallback = cb;
	}
}
