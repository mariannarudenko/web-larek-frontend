import { Cart } from '@/model/cartModel';
import { CartListView } from '@/view/cartListView';
import { CartModalView } from '@/view/cartModalView';
import { EventEmitter } from '@/components/base/events';
import { Logger } from '@/utils/logger';

import type { IBaseProduct } from '@/types';

/**
 * Презентер корзины. Связывает модель, представления и глобальные события.
 */
export class CartPresenter {
	private isMounted = false;

	constructor(
		private model: Cart,
		private listView: CartListView,
		private modalView: CartModalView,
		private events: EventEmitter
	) {
		this.subscribeToEvents();
	}

	/**
	 * Подписывается на глобальные события (добавление, удаление, открытие корзины).
	 */
	private subscribeToEvents() {
		this.events.on('cart:add', (data: { product: IBaseProduct }) => {
			this.model.addItem(data.product);
			Logger.info('Товар добавлен в корзину', { product: data.product });
		});

		this.events.on('cart:remove', (data: { productId: string }) => {
			this.model.removeItem(data.productId);
			Logger.info('Товар удалён из корзины', { productId: data.productId });
		});

		this.events.on('cart:open', () => {
			if (!this.isMounted) {
				this.mountListeners();
				this.isMounted = true;
			}
			this.render();
			this.modalView.showModal();
		});
	}

	/**
	 * Навешивает обработчики событий на представление списка.
	 */
	private mountListeners() {
		this.listView.onRemove((id) => {
			this.model.removeItem(id);
			Logger.info('Товар удалён через UI', { productId: id });
			this.render();
		});

		this.listView.onCheckout(() => {
			this.events.emit('order:open', {
				items: this.model.getItems(),
				total: this.model.getTotalPrice(),
			});
		});
	}

	/**
	 * Отображает актуальное состояние корзины.
	 */
	private render() {
		const items = this.model.getItems();
		const totalPrice = this.model.getTotalPrice();
		const totalCount = this.model.getTotalCount();

		this.listView.render(items, totalPrice);
		this.listView.updateCounter(totalCount);

		Logger.info('Корзина обновлена', {
			items,
			totalPrice,
			totalCount,
		});
	}
}
