import { ensureElement } from '@/utils/utils';
import { BaseView } from '../base/baseView';

/**
 * Представление модального окна для ввода email и телефона.
 * Отвечает за доступ к элементам формы и управление состоянием.
 */
export class ContactsView extends BaseView {
	private element?: HTMLElement;
	private emailInput!: HTMLInputElement;
	private phoneInput!: HTMLInputElement;
	private submitButton!: HTMLButtonElement;

	/**
	 * @param {string} [templateId='contacts'] - ID шаблона формы контактов
	 */
	constructor(templateId = 'contacts') {
		const template = ensureElement<HTMLTemplateElement>(
			`template#${templateId}`
		);
		super(template, '');
	}

	/**
	 * Возвращает корневой элемент формы (создаёт при необходимости).
	 * @returns {HTMLElement} DOM-элемент формы
	 */
	public getElement(): HTMLElement {
		if (!this.element) {
			this.element = this.cloneTemplate();

			const form = ensureElement<HTMLFormElement>(
				this.element.querySelector('form[name="contacts"]') as HTMLFormElement
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

		return this.element;
	}

	/**
	 * Сбрасывает кэшированный DOM-элемент формы.
	 * При следующем вызове getElement() будет создан новый экземпляр.
	 */
	public reset(): void {
		this.element = undefined;
	}

	/**
	 * Очищает значения полей ввода и деактивирует кнопку отправки.
	 */
	public resetFields(): void {
		this.emailInput.value = '';
		this.phoneInput.value = '';
		this.setSubmitEnabled(false);
	}

	/**
	 * Возвращает input-поле email.
	 * @returns {HTMLInputElement} Поле ввода email
	 */
	public getEmailInput(): HTMLInputElement {
		return this.emailInput;
	}

	/**
	 * Возвращает input-поле телефона.
	 * @returns {HTMLInputElement} Поле ввода телефона
	 */
	public getPhoneInput(): HTMLInputElement {
		return this.phoneInput;
	}

	/**
	 * Возвращает кнопку отправки формы.
	 * @returns {HTMLButtonElement} Кнопка отправки
	 */
	public getSubmitButton(): HTMLButtonElement {
		return this.submitButton;
	}

	/**
	 * Активирует или деактивирует кнопку отправки формы.
	 * @param {boolean} enabled - true для активации, false для отключения
	 */
	public setSubmitEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}
}
