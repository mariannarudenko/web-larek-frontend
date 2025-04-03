import { Order } from '@/model/orderModel';
import { ContactsModalView } from '@/view/contactsModalView';
import { validateEmail, validatePhone } from '@/utils/orderValidation';
import { updateValidationUI } from '@/utils/validationUI';
import { EventEmitter } from '@/components/base/events';
import { Logger } from '@/utils/logger';

/**
 * Презентер второго шага оформления заказа: ввод email и телефона.
 * Управляет валидацией, отображением ошибок и завершением шага.
 */
export class ContactsPresenter {
	constructor(
		private model: Order,
		private view: ContactsModalView,
		private onComplete: (data: { email: string; phone: string }) => void,
		private events: EventEmitter
	) {}

	/**
	 * Инициализирует представление, валидацию и обработку событий формы.
	 */
	public init(): void {
		this.events.on('order:reset', () => {
			this.view.resetFields();
		});

		Logger.info('ContactsPresenter инициализирован');

		const emailInput = this.view.getEmailInput();
		const phoneInput = this.view.getPhoneInput();
		const submitButton = this.view.getSubmitButton();

		const updateButtonState = (): void => {
			const email = emailInput.value.trim();
			const phone = phoneInput.value.trim();

			const emailValid = validateEmail(email);
			const phoneValid = validatePhone(phone);

			updateValidationUI(emailInput, emailValid, 'Введите корректный email');
			updateValidationUI(phoneInput, phoneValid, 'Введите номер телефона от 10 до 15 цифр');

			this.view.setSubmitEnabled(emailValid && phoneValid);
		};

		emailInput.addEventListener('input', updateButtonState);
		phoneInput.addEventListener('input', updateButtonState);

		submitButton.addEventListener('click', (e) => {
			e.preventDefault();

			const email = emailInput.value.trim();
			const phone = phoneInput.value.trim();

			const emailValid = validateEmail(email);
			const phoneValid = validatePhone(phone);

			updateValidationUI(emailInput, emailValid, 'Введите корректный email');
			updateValidationUI(phoneInput, phoneValid, 'Введите номер телефона от 10 до 15 цифр');

			if (!emailValid || !phoneValid) {
				Logger.warn('Некорректные контактные данные', { email, phone });
				this.view.setSubmitEnabled(false);
				return;
			}

			this.model.setContacts(email, phone);
			Logger.info('Контактные данные добавлены к заказу', { email, phone });
			this.onComplete({ email, phone });
		});
	}
}
