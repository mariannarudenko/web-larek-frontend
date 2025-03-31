import { ModalView } from './modalView';
import { IFullProduct } from '@/types';
import { ProductView } from './productView';
import { IEvents } from '@/components/base/events';
import { Logger } from '@/utils/logger';

export class ProductModalView extends ModalView {
	private contentElement: HTMLElement;
	private productView: ProductView;

	constructor(events: IEvents, cdnUrl: string) {
		super('modal-container', 'card-preview', cdnUrl);
		this.contentElement = this.modalContainer.querySelector('.modal__content')!;
		this.productView = new ProductView(events);
	}

	/**
	 * Рендерит карточку продукта в модальном окне.
	 * @param product Полные данные продукта.
	 */
	public render(product: IFullProduct & { hasCart: boolean }) {
		const card = this.productView.render(product);
		this.contentElement.innerHTML = '';
		this.contentElement.appendChild(card);
		this.showModal();
	}

	/**
	 * Закрывает модальное окно и очищает содержимое.
	 */
	public close() {
		Logger.info('Закрытие модального окна');
		this.hideModal();
		this.contentElement.innerHTML = '';
	}
}