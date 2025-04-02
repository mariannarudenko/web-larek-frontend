import { ensureElement, BaseView } from '@/utils/utils';

/**
 * Представление модального окна для ввода email и телефона.
 * Содержит только доступ к DOM-элементам, без логики обработки.
 */
export class ContactsModalView extends BaseView {
	private modalElement: HTMLElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;

	/**
	 * @param templateId ID шаблона модального окна (по умолчанию "contacts").
	 */
	constructor(templateId = 'contacts') {
		const template = ensureElement<HTMLTemplateElement>(
			`template#${templateId}`
		);
		super(template, '');

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

	/**
	 * Возвращает корневой элемент модального окна.
	 */
	public getElement(): HTMLElement {
		return this.modalElement;
	}

	/**
	 * Возвращает поле ввода email.
	 */
	public getEmailInput(): HTMLInputElement {
		return this.emailInput;
	}

	/**
	 * Возвращает поле ввода телефона.
	 */
	public getPhoneInput(): HTMLInputElement {
		return this.phoneInput;
	}

	/**
	 * Возвращает кнопку отправки формы.
	 */
	public getSubmitButton(): HTMLButtonElement {
		return this.submitButton;
	}

	/**
	 * Активирует или отключает кнопку отправки.
	 * @param enabled Флаг активности кнопки.
	 */
	public setSubmitEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}
}
