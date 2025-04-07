import { BaseView } from '@/view/base/baseView';
import { ensureElement } from '@/utils/utils';

/**
 * Представление корзины.
 * Отвечает за отображение списка товаров, общей суммы и обработку события оформления заказа.
 */
export class CartView extends BaseView {
	private element: HTMLElement;
	private listEl: HTMLElement;
	private totalEl: HTMLElement;
	private checkoutBtn: HTMLButtonElement;
	private itemTemplate: HTMLTemplateElement;
	private onCheckoutCallback: () => void = () => {};

	/**
	 * Создаёт представление корзины на основе шаблона и инициализирует DOM.
	 */
	constructor() {
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
			this.onCheckoutCallback();
		});
	}

	/**
	 * Возвращает шаблон элемента товара в корзине.
	 * @returns HTML-шаблон карточки товара.
	 */
	public getItemTemplate(): HTMLTemplateElement {
		return this.itemTemplate;
	}

	/**
	 * Возвращает корневой DOM-элемент корзины.
	 * @returns DOM-элемент корзины.
	 */
	public render(): HTMLElement {
		return this.element;
	}

	/**
	 * Очищает данные корзины.
	 */
	public clear(): void {
		this.setItems([]);
		this.setTotal(0);
	}

	/**
	 * Устанавливает элементы товаров в список корзины.
	 * @param items Массив элементов DOM, представляющих товары.
	 */
	public setItems(items: HTMLElement[]): void {
		this.listEl.innerHTML = '';
		items.forEach((el) => {
			this.listEl.appendChild(el);
		});
	}

	/**
	 * Устанавливает отображение общей стоимости заказа.
	 * Также блокирует кнопку оформления, если сумма равна нулю.
	 * @param total Сумма заказа.
	 */
	public setTotal(total: number): void {
		this.totalEl.textContent = `${total} синапсов`;
		this.checkoutBtn.disabled = total === 0;
	}

	/**
	 * Устанавливает обработчик события оформления заказа.
	 * @param cb Функция, вызываемая при оформлении.
	 */
	public setOnCheckout(cb: () => void): void {
		this.onCheckoutCallback = cb;
	}
}
