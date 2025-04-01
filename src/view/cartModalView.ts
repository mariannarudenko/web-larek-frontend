import { ModalView } from './modalView';

/**
 * Представление модального окна корзины.
 */
export class CartModalView extends ModalView {
	/**
	 * Конструктор класса, который инициализирует модальное окно корзины.
	 */
	constructor(cdnUrl: string) {
		super('order-modal', 'basket', cdnUrl);
	}

	public getContentElement(): HTMLElement {
		return this.modalContainer.querySelector('.modal__content')!;
	}
}
