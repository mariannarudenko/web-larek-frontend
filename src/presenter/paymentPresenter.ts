import { Order } from '@/model/orderModel';
import { PaymentModalView } from '@/view/paymentModalView';

import { EventEmitter } from '@/components/base/events';
import { Logger } from '@/utils/logger';

/**
 * Презентер первого шага оформления заказа: оплата и адрес.
 */
export class PaymentPresenter {
	private isMounted = false;

	constructor(
		private model: Order,
		private view: PaymentModalView,
		private onComplete: () => void,
		private events: EventEmitter
	) {}

	/**
	 * Инициализирует представление и навешивает обработчики.
	 */
	public init(): void {
		if (this.isMounted) return;
		this.isMounted = true;

		const paymentButtons = this.view.getPaymentButtons();
		paymentButtons.forEach((btn) =>
			btn.addEventListener('click', () => {
				paymentButtons.forEach((b) => b.classList.remove('button_alt-active'));
				btn.classList.add('button_alt-active');

				const method = btn.getAttribute('name');
				if (method) {
					this.model.setPaymentMethod(method);
					Logger.info('Выбран способ оплаты', { method });
				}

				this.updateNextButtonState();
			})
		);

		const addressInput = this.view.getAddressInput();
		addressInput.addEventListener('input', () => {
			const address = addressInput.value.trim();
			this.model.setAddress(address);
			Logger.info('Введён адрес доставки', { address });
			this.updateNextButtonState();
		});

		this.view.getNextButton().addEventListener('click', (e) => {
			e.preventDefault();
			Logger.info('Переход к следующему шагу оформления заказа');
			this.onComplete();
		});
	}

	/**
	 * Обновляет состояние кнопки "Далее" на основе заполненности формы.
	 */
	private updateNextButtonState(): void {
		const hasAddress = !!this.view.getAddressInput().value.trim();
		const hasPayment = !!this.view.getSelectedPaymentMethod();
		this.view.setNextButtonEnabled(hasAddress && hasPayment);
	}
}
