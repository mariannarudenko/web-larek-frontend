import { Cart } from '@/model/cartModel';
import { ProductModalView } from '@/view/productModalView';
import { ProductValidation } from '../utils/productValidation';

import { IEvents } from '@/components/base/events';
import { Logger } from '@/utils/logger';

import { IFullProduct } from '@/types';

/**
 * Презентер для управления модальным окном продукта.
 * Обрабатывает открытие и синхронизирует состояние кнопки "в корзину".
 */
export class ProductModalPresenter {
	private currentProduct?: IFullProduct;

	/**
	 * Создаёт экземпляр презентера и подписывается на события.
	 * @param view Представление модального окна.
	 * @param events Система событий.
	 * @param cart Модель корзины.
	 */
	constructor(
		private view: ProductModalView,
		private events: IEvents,
		private cart: Cart
	) {
		this.events.on<{ product: IFullProduct & { hasCart: boolean } }>(
			'modal:open',
			({ product }) => {
				if (!ProductValidation.validate(product)) {
					Logger.warn(
						'Продукт не прошёл валидацию. Модальное окно не будет открыто.',
						product
					);
					return;
				}

				this.currentProduct = product;
				this.view.update(product);
				this.view.showModal();
				Logger.info('Открыто модальное окно товара', { id: product.id });
			}
		);

		this.events.on('cart:changed', () => {
			this.updateView();
		});
	}

	/**
	 * Обновляет представление, если продукт открыт в модалке.
	 */
	private updateView(): void {
		if (!this.currentProduct || !this.view.isVisible()) return;

		const hasCart = this.cart.hasItem(this.currentProduct.id);
		this.view.update({ ...this.currentProduct, hasCart });

		Logger.info('Обновлено состояние кнопки "в корзину" в модалке', {
			id: this.currentProduct.id,
			hasCart,
		});
	}
}
