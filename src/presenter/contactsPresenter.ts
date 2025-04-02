import { Order } from '@/model/orderModel';
import { ContactsModalView } from '@/view/contactsModalView';
import { Logger } from '@/utils/logger';

/**
 * Презентер второго шага оформления заказа — ввод email и телефона.
 */
export class ContactsPresenter {
	private isMounted = false;

	constructor(
		private model: Order,
		private view: ContactsModalView,
		private onComplete: (data: { email: string; phone: string }) => void
	) {}

	/**
	 * Инициализирует представление и навешивает обработчики.
	 */
	public init(): void {
		if (this.isMounted) return;
		this.isMounted = true;
		Logger.info('ContactsPresenter инициализирован');

		const emailInput = this.view.getEmailInput();
		const phoneInput = this.view.getPhoneInput();
		const submitButton = this.view.getSubmitButton();

		const updateButtonState = () => {
			const email = emailInput.value.trim();
			const phone = phoneInput.value.trim();
			const isValid = this.validateEmail(email) && this.validatePhone(phone);
			this.view.setSubmitEnabled(isValid);
		};

		emailInput.addEventListener('input', updateButtonState);
		phoneInput.addEventListener('input', updateButtonState);

		submitButton.addEventListener('click', (e) => {
			e.preventDefault();

			const email = emailInput.value.trim();
			const phone = phoneInput.value.trim();

			if (!this.validateEmail(email) || !this.validatePhone(phone)) {
				Logger.warn('Некорректные контактные данные', { email, phone });
				this.view.setSubmitEnabled(false);
				return;
			}

			this.model.setContacts(email, phone);
			Logger.info('Контактные данные добавлены к заказу', { email, phone });
			this.onComplete({ email, phone });
		});
	}

	/**
	 * Проверка email с помощью регулярного выражения.
	 */
	private validateEmail(email: string): boolean {
		const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return pattern.test(email);
	}

	/**
	 * Проверка телефона: от 10 до 15 цифр, можно с "+".
	 */
	private validatePhone(phone: string): boolean {
		const pattern = /^\+?\d{10,15}$/;
		return pattern.test(phone);
	}
}
