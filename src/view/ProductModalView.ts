import { ModalView } from './modalView';
import { IFullProduct } from '@/types';
import { ProductView } from './productView';
import { IEvents } from '@/components/base/events';
import { Logger } from '@/utils/logger';
import { ensureElement } from '@/utils/utils';

/**
 * Представление модального окна для отображения карточки товара.
 * Использует ProductView для отрисовки содержимого и наследует ModalView.
 */
export class ProductModalView extends ModalView {
	private productView: ProductView;

	/**
	 * @param events Интерфейс событий для взаимодействия с карточкой товара.
	 * @param cdnUrl URL для загрузки изображений и ресурсов.
	 */
	constructor(events: IEvents, cdnUrl: string) {
		super('modal-container', 'card-preview', cdnUrl);
		this.productView = new ProductView(events);
	}

	/**
	 * Рендерит карточку продукта в модальном окне.
	 *
	 * @param product Полные данные продукта, включая признак наличия в корзине.
	 */
	public render(product: IFullProduct & { hasCart: boolean }) {
		const contentElement = ensureElement<HTMLElement>(
			this.modalContainer.querySelector('.modal__content') as HTMLElement
		);

		const card = this.productView.render(product);
		contentElement.innerHTML = '';
		contentElement.appendChild(card);
		this.showModal();
	}

	/**
	 * Закрывает модальное окно и очищает его содержимое.
	 */
	public close() {
		Logger.info('Закрытие модального окна');
		this.hideModal();
		const contentElement = this.modalContainer.querySelector(
			'.modal__content'
		) as HTMLElement | null;
		if (contentElement) contentElement.innerHTML = '';
	}
}
