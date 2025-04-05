import { ensureElement } from '@/utils/utils';
import { BaseView } from '../base/baseView';
import { EventEmitter } from '@/components/base/events';
import { ModalManager } from '../base/modalManager';

interface PaymentViewProps {
	eventBus: EventEmitter;
	modalManager: ModalManager;
	onNext?: (data: { payment: string; address: string }) => void;
}

/**
 * Представление формы оплаты и адреса доставки.
 * Используется на этапе оформления заказа, отображается в модальном окне.
 */
export class PaymentView extends BaseView {
	private element: HTMLElement;
	private paymentButtons: HTMLButtonElement[];
	private addressInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;
	private eventBus: EventEmitter;
	private modalManager: ModalManager;
	public onNext?: (data: { payment: string; address: string }) => void;

	/**
	 * Создает экземпляр PaymentView.
	 * @param props - Объект с шиной событий, модальным менеджером и необязательным колбэком перехода к следующему шагу.
	 * @param templateId - Идентификатор HTML-шаблона (по умолчанию `'order'`).
	 * @throws Ошибка, если шаблон не найден.
	 */
	constructor({ eventBus, modalManager, onNext }: PaymentViewProps, templateId = 'order') {
		const template = ensureElement<HTMLTemplateElement>(`template#${templateId}`);
		super(template, '');

		const fragment = this.cloneTemplate();
		this.element = fragment.firstElementChild as HTMLElement;

		this.eventBus = eventBus;
		this.modalManager = modalManager;
		this.onNext = onNext;

		const form = this.element as HTMLFormElement;

		this.paymentButtons = Array.from(
			form.querySelectorAll<HTMLButtonElement>('.order__buttons .button')
		);

		this.addressInput = ensureElement<HTMLInputElement>(
			form.querySelector('input[name="address"]') as HTMLInputElement
		);

		this.submitButton = ensureElement<HTMLButtonElement>(
			form.querySelector('button[type="submit"]') as HTMLButtonElement
		);

		this.setNextButtonEnabled(false);

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.paymentButtons.forEach((b) => b.classList.remove('button_alt-active'));
				button.classList.add('button_alt-active');
				this.checkFormValidity();
			});
		});

		this.addressInput.addEventListener('input', () => {
			this.checkFormValidity();
		});

		form.addEventListener('submit', (event) => {
			event.preventDefault();

			const data = {
				payment: this.getSelectedPaymentMethod()!,
				address: this.addressInput.value.trim(),
			};

			this.onNext?.(data);
		});

		this.eventBus.on('order:openPayment', () => {
			this.resetFields();
			this.modalManager.setContent(this.render());
			this.modalManager.show();
		});
	}

	/**
	 * Возвращает DOM-элемент формы оплаты.
	 * @returns HTML-элемент формы.
	 */
	public render(): HTMLElement {
		return this.element;
	}

	/**
	 * Сбрасывает выбранные значения формы.
	 */
	public resetFields(): void {
		this.addressInput.value = '';
		this.paymentButtons.forEach((button) =>
			button.classList.remove('button_alt-active')
		);
		this.setNextButtonEnabled(false);
	}

	/**
	 * Проверяет корректность заполнения формы и включает/отключает кнопку "Далее".
	 */
	private checkFormValidity(): void {
		const addressFilled = this.addressInput.value.trim().length > 0;
		const paymentSelected = this.getSelectedPaymentMethod() !== null;
		this.setNextButtonEnabled(addressFilled && paymentSelected);
	}

	/**
	 * Возвращает выбранный способ оплаты.
	 * @returns Название метода оплаты или `null`, если не выбран.
	 */
	public getSelectedPaymentMethod(): string | null {
		const selected = this.paymentButtons.find((b) =>
			b.classList.contains('button_alt-active')
		);
		return selected?.name || null;
	}

	/**
	 * Устанавливает активность кнопки перехода к следующему шагу.
	 * @param enabled - Флаг активности (true — активна, false — отключена).
	 */
	public setNextButtonEnabled(enabled: boolean): void {
		this.submitButton.disabled = !enabled;
	}
}
