import { ModalView } from './modalView';
import { ProductView } from './productView';
import { IEvents } from '@/components/base/events';
import { ensureElement } from '@/utils/utils';
import { Logger } from '@/utils/logger';
import { IFullProduct } from '@/types';

/**
 * Представление модального окна для отображения карточки товара.
 */
export class ProductModalView extends ModalView {
	private productView: ProductView;

	/**
	 * @param events Система событий.
	 * @param cdnUrl Базовый URL для загрузки ресурсов.
	 */
	constructor(events: IEvents, cdnUrl: string) {
		super('card-preview', cdnUrl);
		this.productView = new ProductView(events);
	}

	/**
	 * Обновляет содержимое модального окна продуктовой карточкой.
	 * Не вызывает открытие — это должно происходить вручную.
	 * @param product Продукт с дополнительным свойством hasCart.
	 */
	public update(product: IFullProduct & { hasCart: boolean }): void {
		const contentElement = ensureElement<HTMLElement>(
			this.modalContainer.querySelector('.modal__content') as HTMLElement
		);

		const card = this.productView.render(product);
		contentElement.innerHTML = '';
		contentElement.appendChild(card);

		Logger.info('Модальное окно обновлено карточкой товара', {
			id: product.id,
		});
	}

	/**
	 * Проверяет, открыто ли модальное окно.
	 * @returns true, если модальное окно активно.
	 */
	public isVisible(): boolean {
		return this.modalContainer.classList.contains('modal_active');
	}

	/**
	 * Закрывает модальное окно и очищает его содержимое.
	 */
	public close(): void {
		Logger.info('Закрытие модального окна товара');
		this.hideModal();

		const contentElement = this.modalContainer.querySelector(
			'.modal__content'
		) as HTMLElement | null;

		if (contentElement) {
			contentElement.innerHTML = '';
		}
	}
}
