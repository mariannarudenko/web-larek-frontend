import { ModalView } from './modalView';

/**
 * Представление модального окна корзины.
 */
export class CartModalView extends ModalView {
	/**
	 * @param cdnUrl URL для ресурсов (например, изображений).
	 */
	constructor(cdnUrl: string) {
		super('basket', cdnUrl);
	}

	/**
	 * Возвращает DOM-элемент с контентом модального окна.
	 */
	public getContentElement(): HTMLElement {
		return this.modalContainer.querySelector('.modal__content')!;
	}
}
