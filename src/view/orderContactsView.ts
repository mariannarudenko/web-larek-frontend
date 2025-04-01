import { ModalView } from './modalView';
import { ensureElement } from '@/utils/utils';

/**
 * Представление модального окна ввода контактных данных покупателя.
 * Наследуется от базового модального представления ModalView.
 */
export class OrderContactsView extends ModalView {
	constructor() {
		super('order-contacts', 'contacts');
	}

	/**
	 * Подписка на отправку формы с контактными данными.
	 * Выполняет валидацию полей перед отправкой.
	 *
	 * @param handler Обработчик отправки формы с контактами.
	 */
	onSubmit(handler: (data: { email: string; phone: string }) => void) {
		const form = ensureElement<HTMLFormElement>(
			this.modalContainer.querySelector(
				'form[name="contacts"]'
			) as HTMLFormElement
		);

		const emailInput = ensureElement<HTMLInputElement>(
			form.querySelector('input[name="email"]') as HTMLInputElement
		);

		const phoneInput = ensureElement<HTMLInputElement>(
			form.querySelector('input[name="phone"]') as HTMLInputElement
		);

		const submitButton = ensureElement<HTMLButtonElement>(
			form.querySelector('button[type="submit"]') as HTMLButtonElement
		);

		/**
		 * Простая валидация полей формы (email и телефон не должны быть пустыми).
		 */
		const validate = () => {
			const emailValid = emailInput.value.trim();
			const phoneValid = phoneInput.value.trim();
			submitButton.disabled = !(emailValid && phoneValid);
		};

		emailInput.addEventListener('input', validate);
		phoneInput.addEventListener('input', validate);

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			handler({
				email: emailInput.value,
				phone: phoneInput.value,
			});
		});
	}
}
