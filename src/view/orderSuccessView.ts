import { ModalView } from './modalView';
import { ensureElement } from '@/utils/utils';

/**
 * Представление модального окна успешного оформления заказа.
 * Наследуется от базового модального окна ModalView.
 */
export class OrderSuccessView extends ModalView {
	constructor() {
		super('order-success', 'success');
	}

	/**
	 * Отображает сумму списанных синапсов и навешивает обработчик на кнопку закрытия.
	 *
	 * @param total Сумма заказа, которая была списана.
	 */
	render(total: number) {
		const totalElement = ensureElement<HTMLElement>(
			this.modalContainer.querySelector(
				'.order-success__description'
			) as HTMLElement
		);

		const closeButton = ensureElement<HTMLButtonElement>(
			this.modalContainer.querySelector(
				'.order-success__close'
			) as HTMLButtonElement
		);

		totalElement.textContent = `Списано ${total} синапсов`;

		closeButton.addEventListener('click', () => {
			this.hideModal();
		});
	}
}
