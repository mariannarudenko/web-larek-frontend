import { ensureElement } from '@/utils/utils';
import { BaseView } from '../base/baseView';

/**
 * Представление формы оплаты и адреса доставки.
 * Используется на этапе оформления заказа, отображается в модальном окне.
 */
export class PaymentView extends BaseView {
	private element: HTMLElement;
	private paymentButtons: HTMLButtonElement[];
	private addressInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;
	private onNextCallback: (data: { payment: string; address: string }) => void =
		() => {};
	private onInputCallback: (data: {
		payment: string;
		address: string;
	}) => void = () => {};

	/**
	 * Создает экземпляр PaymentView.
	 * @param props - Объект с шиной событий, модальным менеджером и необязательным колбэком перехода к следующему шагу.
	 * @param templateId - Идентификатор HTML-шаблона (по умолчанию `'order'`).
	 * @throws Ошибка, если шаблон не найден.
	 */
	constructor(templateId = 'order') {
		const template = ensureElement<HTMLTemplateElement>(
			`template#${templateId}`
		);
		super(template, '');

		const fragment = this.cloneTemplate();
		this.element = fragment.firstElementChild as HTMLElement;

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
				this.paymentButtons.forEach((b) =>
					b.classList.remove('button_alt-active')
				);
				button.classList.add('button_alt-active');

				this.onInputCallback({
					payment: this.getSelectedPaymentMethod() || '',
					address: this.addressInput.value,
				});
			});
		});

		this.addressInput.addEventListener('input', () => {
			this.onInputCallback({
				payment: this.getSelectedPaymentMethod() || '',
				address: this.addressInput.value,
			});
		});

		form.addEventListener('submit', (event) => {
			event.preventDefault();

			const data = {
				payment: this.getSelectedPaymentMethod()!,
				address: this.addressInput.value.trim(),
			};

			this.onNextCallback(data);
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

	/**
	 * Устанавливает callback-функцию, вызываемую при переходе к следующему шагу оформления заказа.
	 */
	public setOnNext(
		cb: (data: { payment: string; address: string }) => void
	): void {
		this.onNextCallback = cb;
	}

	/**
	 * Устанавливает callback, вызываемый при любом вводе (адрес или выбор оплаты)
	 */
	public setOnInput(
		cb: (data: { payment: string; address: string }) => void
	): void {
		this.onInputCallback = cb;
	}
}
