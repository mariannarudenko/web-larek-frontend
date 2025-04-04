import { ensureElement } from '@/utils/utils';
import { BaseView } from '../base/baseView';

/**
 * Представление модального окна выбора способа оплаты и адреса.
 * Отвечает за отображение и доступ к DOM-элементам формы.
 */
export class PaymentView extends BaseView {
	private element?: HTMLElement;
	private paymentButtons: HTMLButtonElement[] = [];
	private addressInput!: HTMLInputElement;
	private submitButton!: HTMLButtonElement;

	/**
	 * @param {string} [templateId='order'] - ID шаблона формы заказа
	 */
	constructor(templateId = 'order') {
		const template = ensureElement<HTMLTemplateElement>(
			`template#${templateId}`
		);
		super(template, '');
	}

	/**
	 * Возвращает корневой DOM-элемент формы. Создаёт при первом обращении.
	 * @returns {HTMLElement} DOM-элемент формы
	 */
	public getElement(): HTMLElement {
		if (!this.element) {
			this.element = this.cloneTemplate();

			const form = ensureElement<HTMLFormElement>(
				this.element.querySelector('form[name="order"]') as HTMLFormElement
			);

			this.paymentButtons = Array.from(
				form.querySelectorAll<HTMLButtonElement>('.order__buttons .button')
			);

			this.addressInput = ensureElement<HTMLInputElement>(
				form.querySelector('input[name="address"]') as HTMLInputElement
			);

			this.submitButton = ensureElement<HTMLButtonElement>(
				form.querySelector('button[type="submit"]') as HTMLButtonElement
			);
		}

		return this.element;
	}

	/**
	 * Сбрасывает DOM-элемент формы.
	 * При следующем вызове `getElement` будет создан новый экземпляр.
	 */
	public reset(): void {
		this.element = undefined;
	}

	/**
	 * Очищает значение адреса и сбрасывает выбор способа оплаты.
	 * Не пересоздаёт DOM.
	 */
	public resetFields(): void {
		this.addressInput.value = '';
		this.paymentButtons.forEach((button) =>
			button.classList.remove('button_alt-active')
		);
		this.setNextButtonEnabled(false);
	}

	/**
	 * Возвращает список кнопок выбора способа оплаты.
	 * @returns {HTMLButtonElement[]} Кнопки оплаты
	 */
	public getPaymentButtons(): HTMLButtonElement[] {
		return this.paymentButtons;
	}

	/**
	 * Возвращает поле ввода адреса.
	 * @returns {HTMLInputElement} Поле адреса
	 */
	public getAddressInput(): HTMLInputElement {
		return this.addressInput;
	}

	/**
	 * Возвращает кнопку перехода к следующему шагу.
	 * @returns {HTMLButtonElement} Кнопка "Далее"
	 */
	public getNextButton(): HTMLButtonElement {
		return this.submitButton;
	}

	/**
	 * Возвращает имя выбранного способа оплаты.
	 * @returns {string | null} Название метода или null, если не выбран
	 */
	public getSelectedPaymentMethod(): string | null {
		const selected = this.paymentButtons.find((b) =>
			b.classList.contains('button_alt-active')
		);
		return selected?.name || null;
	}

	/**
	 * Включает или отключает кнопку перехода к следующему шагу.
	 * @param {boolean} enabled - true для включения, false для отключения
	 */
	public setNextButtonEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}
}
