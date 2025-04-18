import { ensureElement } from '@/utils/utils';
import { BaseView } from '../base/baseView';

/**
 * Представление формы ввода контактных данных.
 * Используется для оформления заказа и отображается в модальном окне.
 */
export class ContactsView extends BaseView {
	private element: HTMLElement;
	private emailError: HTMLElement;
	private phoneError: HTMLElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;
	private onSubmitCallback: (data: { email: string; phone: string }) => void =
		() => {};
	private onInputCallback: (data: { email: string; phone: string }) => void =
		() => {};

	/**
	 * Создаёт экземпляр ContactsView.
	 * @param props - Объект с шиной событий, модальным менеджером и необязательной функцией обработки отправки.
	 * @param templateId - Идентификатор HTML-шаблона (по умолчанию `'contacts'`).
	 * @throws Ошибка, если шаблон не найден.
	 */
	constructor(templateId = 'contacts') {
		const template = ensureElement<HTMLTemplateElement>(
			`template#${templateId}`
		);
		super(template, '');

		const fragment = this.cloneTemplate();
		this.element = fragment.firstElementChild as HTMLElement;

		const form = this.element as HTMLFormElement;

		this.emailError = ensureElement(form.querySelector('.error-email') as HTMLElement);
		this.phoneError = ensureElement(form.querySelector('.error-phone') as HTMLElement);

		this.emailInput = ensureElement<HTMLInputElement>(
			form.querySelector('input[name="email"]') as HTMLInputElement
		);

		this.phoneInput = ensureElement<HTMLInputElement>(
			form.querySelector('input[name="phone"]') as HTMLInputElement
		);

		this.submitButton = ensureElement<HTMLButtonElement>(
			form.querySelector('button[type="submit"]') as HTMLButtonElement
		);

		this.setSubmitEnabled(false);

		form.addEventListener('input', () => {
			this.onInputCallback({
				email: this.emailInput.value.trim(),
				phone: this.phoneInput.value.trim(),
			});
		});

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			this.onSubmitCallback({
				email: this.emailInput.value.trim(),
				phone: this.phoneInput.value.trim(),
			});
		});
	}

	/**
	 * Возвращает DOM-элемент формы контактов.
	 * @returns HTML-элемент формы.
	 */
	public getElement(): HTMLElement {
		return this.element;
	}

	/**
	 * Сбрасывает значения полей и отключает кнопку отправки.
	 */
	public resetFields(): void {
		this.emailInput.value = '';
		this.phoneInput.value = '';
		this.setSubmitEnabled(false);
	}

	/**
	 * Устанавливает состояние доступности кнопки отправки.
	 * @param enabled - Флаг доступности (true — доступна, false — отключена).
	 */
	public setSubmitEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}

	/**
	 * Устанавливает колбэк, который вызывается при отправке формы с контактными данными.
	 *
	 * @param {{ email: string, phone: string }} data - Введённые email и телефон
	 */
	public setOnSubmit(
		cb: (data: { email: string; phone: string }) => void
	): void {
		this.onSubmitCallback = cb;
	}

	/**
	 * Устанавливает колбэк, который вызывается при валидных полях.
	 *
	 * @param {{ email: string, phone: string }} data - Введённые email и телефон
	 */
	public setOnInput(
		cb: (data: { email: string; phone: string }) => void
	): void {
		this.onInputCallback = cb;
	}

	/**
	 * Устанавливает ошибки, которые появляются при невалидных полях.
	 */
	public updateValidationState(errors: {
		email?: string;
		phone?: string;
		isValid: boolean;
	}) {
		this.emailError.textContent = errors.email || '';
		this.phoneError.textContent = errors.phone || '';
		this.setSubmitEnabled(errors.isValid);
	}
}
