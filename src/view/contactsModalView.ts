import { ensureElement, BaseView } from '@/utils/utils';

/**
 * Представление модального окна для ввода email и телефона.
 * Содержит только доступ к DOM-элементам, без логики обработки.
 */
export class ContactsModalView extends BaseView {
	private modalElement?: HTMLElement;
	private emailInput!: HTMLInputElement;
	private phoneInput!: HTMLInputElement;
	private submitButton!: HTMLButtonElement;

	constructor(templateId = 'contacts') {
		const template = ensureElement<HTMLTemplateElement>(
			`template#${templateId}`
		);
		super(template, '');
	}

	/**
	 * Возвращает корневой элемент модального окна (пересоздаёт при необходимости).
	 */
	public getElement(): HTMLElement {
		if (!this.modalElement) {
			this.modalElement = this.cloneTemplate();

			const form = ensureElement<HTMLFormElement>(
				this.modalElement.querySelector(
					'form[name="contacts"]'
				) as HTMLFormElement
			);

			this.emailInput = ensureElement<HTMLInputElement>(
				form.querySelector('input[name="email"]') as HTMLInputElement
			);

			this.phoneInput = ensureElement<HTMLInputElement>(
				form.querySelector('input[name="phone"]') as HTMLInputElement
			);

			this.submitButton = ensureElement<HTMLButtonElement>(
				form.querySelector('button[type="submit"]') as HTMLButtonElement
			);
		}

		return this.modalElement;
	}

	/**
	 * Сбрасывает DOM-элемент — при следующем рендере будет создан заново.
	 */
	public reset(): void {
		this.modalElement = undefined;
	}

	/**
	 * Явно очищает поля ввода и состояние кнопки.
	 */
	public resetFields(): void {
		this.emailInput.value = '';
		this.phoneInput.value = '';
		this.setSubmitEnabled(false);
	}

	public getEmailInput(): HTMLInputElement {
		return this.emailInput;
	}

	public getPhoneInput(): HTMLInputElement {
		return this.phoneInput;
	}

	public getSubmitButton(): HTMLButtonElement {
		return this.submitButton;
	}

	public setSubmitEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}
}
