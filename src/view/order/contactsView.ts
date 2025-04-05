import { ensureElement } from '@/utils/utils';
import { BaseView } from '../base/baseView';
import { EventEmitter } from '@/components/base/events';
import { ModalManager } from '../base/modalManager';

interface ContactsViewProps {
	eventBus: EventEmitter;
	modalManager: ModalManager;
	onSubmit?: (data: { email: string; phone: string }) => void;
}

/**
 * Представление формы ввода контактных данных.
 * Используется для оформления заказа и отображается в модальном окне.
 */
export class ContactsView extends BaseView {
	private element: HTMLElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;

	private eventBus: EventEmitter;
	private modalManager: ModalManager;
	public onSubmit?: (data: { email: string; phone: string }) => void;

	/**
	 * Создаёт экземпляр ContactsView.
	 * @param props - Объект с шиной событий, модальным менеджером и необязательной функцией обработки отправки.
	 * @param templateId - Идентификатор HTML-шаблона (по умолчанию `'contacts'`).
	 * @throws Ошибка, если шаблон не найден.
	 */
	constructor({ eventBus, modalManager, onSubmit }: ContactsViewProps, templateId = 'contacts') {
		const template = ensureElement<HTMLTemplateElement>(
			`template#${templateId}`
		);
		super(template, '');

		const fragment = this.cloneTemplate();
		this.element = fragment.firstElementChild as HTMLElement;

		this.eventBus = eventBus;
		this.modalManager = modalManager;
		this.onSubmit = onSubmit;

		const form = this.element as HTMLFormElement;

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

		this.emailInput.addEventListener('input', () => this.checkFormValidity());
		this.phoneInput.addEventListener('input', () => this.checkFormValidity());

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const data = {
				email: this.emailInput.value.trim(),
				phone: this.phoneInput.value.trim(),
			};
			this.onSubmit?.(data);
		});

		this.eventBus.on('order:openContacts', () => {
			this.resetFields();
			this.modalManager.setContent(this.getElement());
			this.modalManager.show();
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
	 * Проверяет валидность формы и включает/отключает кнопку отправки.
	 */
	private checkFormValidity(): void {
		const emailValid = this.emailInput.value.trim().length > 0;
		const phoneValid = this.phoneInput.value.trim().length > 0;
		this.setSubmitEnabled(emailValid && phoneValid);
	}

	/**
	 * Устанавливает состояние доступности кнопки отправки.
	 * @param enabled - Флаг доступности (true — доступна, false — отключена).
	 */
	public setSubmitEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}
}
