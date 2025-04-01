import { Cart } from '@/model/cartModel';
import { CartListView } from '@/view/cartListView';
import { CartModalView } from '@/view/cartModalView';
import { EventEmitter } from '@/components/base/events';
import { Logger } from '@/utils/logger';
import type { IBaseProduct } from '@/types';

/**
 * Презентер корзины, связывающий модель, представление списка и модальное окно.
 */
export class CartPresenter {
	private isMounted = false; // Флаг, чтобы события не дублировались

	constructor(
		private model: Cart,
		private listView: CartListView,
		private modalView: CartModalView,
		private events: EventEmitter
	) {
		this.subscribeToEvents();
	}

	/**
	 * Подписывается на глобальные события (добавление/удаление товаров, открытие корзины).
	 */
	private subscribeToEvents() {
		this.events.on('cart:add', (data: { product: IBaseProduct }) => {
			this.model.addItem(data.product);
			this.render();
			Logger.info('Товар добавлен в корзину', { product: data.product });
		});

		this.events.on('cart:remove', (data: { productId: string }) => {
			this.model.removeItem(data.productId);
			this.render();
			Logger.info('Товар удалён из корзины', { productId: data.productId });
		});

		this.events.on('cart:open', () => {
			console.log('[CartPresenter] cart:open получен');
			if (!this.isMounted) {
				this.mountListeners(); // теперь навешиваем слушатели один раз
				this.isMounted = true;
			}
			this.render();
			this.modalView.showModal();
		});
	}

	/**
	 * Навешивает обработчики UI для удаления и оформления заказа.
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
			this.modalView.hideModal();
		});
	}

	/**
	 * Рендерит корзину и обновляет данные.
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
