import { ensureElement, BaseView } from '@/utils/utils';

/**
 * Представление модального окна выбора способа оплаты и адреса.
 * Отвечает только за отображение и доступ к элементам формы.
 */
export class PaymentModalView extends BaseView {
	private element?: HTMLElement;
	private paymentButtons: HTMLButtonElement[] = [];
	private addressInput!: HTMLInputElement;
	private submitButton!: HTMLButtonElement;

	constructor(templateId = 'order') {
		const template = ensureElement<HTMLTemplateElement>(
			`template#${templateId}`
		);
		super(template, '');
	}

	/**
	 * Возвращает корневой элемент, пересоздавая его при необходимости.
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
	 * Сбрасывает DOM — шаблон будет пересоздан при следующем рендере.
	 */
	public reset(): void {
		this.element = undefined;
	}

	/**
	 * Явно очищает значения полей и кнопок, не пересоздавая DOM.
	 */
	public resetFields(): void {
		this.addressInput.value = '';
		this.paymentButtons.forEach((button) =>
			button.classList.remove('button_alt-active')
		);
		this.setNextButtonEnabled(false);
	}

	public getPaymentButtons(): HTMLButtonElement[] {
		return this.paymentButtons;
	}

	public getAddressInput(): HTMLInputElement {
		return this.addressInput;
	}

	public getNextButton(): HTMLButtonElement {
		return this.submitButton;
	}

	public getSelectedPaymentMethod(): string | null {
		const selected = this.paymentButtons.find((b) =>
			b.classList.contains('button_alt-active')
		);
		return selected?.name || null;
	}

	public setNextButtonEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}
}
