import { Order } from '@/model/orderModel';
import { PaymentModalView } from '@/view/paymentModalView';
import { validateAddress } from '@/utils/orderValidation';
import { updateValidationUI } from '@/utils/validationUI';

import { EventEmitter } from '@/components/base/events';
import { Logger } from '@/utils/logger';

/**
 * Презентер первого шага оформления заказа: выбор оплаты и ввод адреса.
 * Управляет валидацией, отображением состояния и переходом к следующему шагу.
 */
export class PaymentPresenter {
	constructor(
		private model: Order,
		private view: PaymentModalView,
		private onComplete: () => void,
		private events: EventEmitter
	) {}

	/**
	 * Инициализирует представление и обрабатывает события пользовательского ввода.
	 */
	public init(): void {
		this.bindEvents();

		this.view.getPaymentButtons().forEach((btn) =>
			btn.addEventListener('click', () => {
				this.handlePaymentSelection(btn);
			})
		);

		this.view.getAddressInput().addEventListener('input', () => {
			this.handleAddressInput();
		});

		this.view.getNextButton().addEventListener('click', (e) => {
			e.preventDefault();
			Logger.info('Переход к следующему шагу оформления заказа');
			this.onComplete();
		});
	}

	private handlePaymentSelection(button: HTMLButtonElement): void {
		this.view
			.getPaymentButtons()
			.forEach((b) => b.classList.remove('button_alt-active'));
		button.classList.add('button_alt-active');

		const method = button.getAttribute('name');
		if (method) {
			this.model.setPaymentMethod(method);
			Logger.info('Выбран способ оплаты', { method });
		}

		this.updateNextButtonState();
	}

	private handleAddressInput(): void {
		const input = this.view.getAddressInput();
		const address = input.value.trim();
		const isValid = validateAddress(address);

		updateValidationUI(
			input,
			isValid,
			'Введите корректный адрес (минимум 5 символов)'
		);

		if (isValid) {
			this.model.setAddress(address);
			Logger.info('Введён адрес доставки', { address });
		} else {
			this.model.setAddress('');
			Logger.warn('Введён некорректный адрес', { address });
		}

		this.updateNextButtonState();
	}

	private updateNextButtonState(): void {
		const addressValid = validateAddress(
			this.view.getAddressInput().value.trim()
		);
		const hasPayment = !!this.view.getSelectedPaymentMethod();
		this.view.setNextButtonEnabled(addressValid && hasPayment);
	}

	private bindEvents(): void {
		this.events.on('order:reset', () => {
			this.view.resetFields();
		});
	}
}
