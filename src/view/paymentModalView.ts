import { ensureElement, BaseView } from '@/utils/utils';

/**
 * Представление модального окна выбора способа оплаты и адреса.
 * Отвечает только за отображение и доступ к элементам формы.
 */
export class PaymentModalView extends BaseView {
	private element: HTMLElement;
	private paymentButtons: HTMLButtonElement[];
	private addressInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;

	/**
	 * @param templateId ID шаблона формы (по умолчанию "order").
	 */
	constructor(templateId = 'order') {
		const template = ensureElement<HTMLTemplateElement>(
			`template#${templateId}`
		);
		super(template, '');

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

	/**
	 * Возвращает корневой элемент модального окна.
	 */
	public getElement(): HTMLElement {
		return this.element;
	}

	/**
	 * Возвращает список кнопок выбора способа оплаты.
	 */
	public getPaymentButtons(): HTMLButtonElement[] {
		return this.paymentButtons;
	}

	/**
	 * Возвращает поле ввода адреса.
	 */
	public getAddressInput(): HTMLInputElement {
		return this.addressInput;
	}

	/**
	 * Возвращает кнопку перехода к следующему шагу.
	 */
	public getNextButton(): HTMLButtonElement {
		return this.submitButton;
	}

	/**
	 * Возвращает название выбранного способа оплаты.
	 */
	public getSelectedPaymentMethod(): string | null {
		const selected = this.paymentButtons.find((b) =>
			b.classList.contains('button_alt-active')
		);
		return selected?.name || null;
	}

	/**
	 * Активирует или блокирует кнопку перехода к следующему шагу.
	 * @param enabled Флаг активности кнопки.
	 */
	public setNextButtonEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}
}
