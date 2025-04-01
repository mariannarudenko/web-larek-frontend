import { ModalView } from './modalView';
import { ensureElement } from '@/utils/utils';

/**
 * Представление модального окна выбора способа оплаты и ввода адреса доставки.
 * Наследуется от базового модального представления ModalView.
 */
export class OrderPaymentView extends ModalView {
	constructor() {
		super('order-payment', 'order');
	}

	/**
	 * Подписка на отправку формы с выбранным способом оплаты и адресом доставки.
	 *
	 * @param handler Обработчик отправки данных формы оплаты.
	 */
	onSubmit(handler: (data: { payment: string; address: string }) => void) {
		const form = ensureElement<HTMLFormElement>(
			this.modalContainer.querySelector('form[name="order"]') as HTMLFormElement
		);

		const addressInput = ensureElement<HTMLInputElement>(
			form.querySelector('input[name="address"]') as HTMLInputElement
		);

		const paymentButtons = form.querySelectorAll<HTMLButtonElement>(
			'.order__buttons .button'
		);

		const submitButton = ensureElement<HTMLButtonElement>(
			form.querySelector('button[type="submit"]') as HTMLButtonElement
		);

		let selectedPayment = '';

		/**
		 * Обработка выбора способа оплаты и валидация формы.
		 */
		paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				selectedPayment = button.name;
				paymentButtons.forEach((btn) =>
					btn.classList.remove('button_alt-active')
				);
				button.classList.add('button_alt-active');
				this.validate(addressInput, selectedPayment, submitButton);
			});
		});

		/**
		 * Валидация поля адреса при вводе.
		 */
		addressInput.addEventListener('input', () => {
			this.validate(addressInput, selectedPayment, submitButton);
		});

		/**
		 * Обработка отправки формы.
		 */
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			handler({
				payment: selectedPayment,
				address: addressInput.value,
			});
		});
	}

	/**
	 * Валидация формы выбора оплаты и адреса доставки.
	 * Активирует или деактивирует кнопку отправки формы.
	 *
	 * @param addressInput Поле ввода адреса.
	 * @param selectedPayment Выбранный способ оплаты.
	 * @param submitButton Кнопка отправки формы.
	 */
	private validate(
		addressInput: HTMLInputElement,
		selectedPayment: string,
		submitButton: HTMLButtonElement
	) {
		const isValid = selectedPayment && addressInput.value.trim();
		submitButton.disabled = !isValid;
	}
}
