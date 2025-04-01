import { Order } from '@/model/orderModel';
import { OrderPaymentView } from '@/view/orderPaymentView';
import { OrderContactsView } from '@/view/orderContactsView';
import { OrderSuccessView } from '@/view/orderSuccessView';
import { EventEmitter } from '@/components/base/events';
import type { ICartItem } from '@/types';

/**
 * Контроллер (Presenter) процесса оформления заказа.
 * Связывает модель заказа и представления этапов оформления заказа.
 */
export class OrderPresenter {
	/**
	 * @param events Система событий для связи компонентов.
	 * @param model Модель данных заказа.
	 * @param contactsView Представление ввода контактных данных.
	 * @param paymentView Представление выбора способа оплаты.
	 * @param successView Представление успешного оформления заказа.
	 */
	constructor(
		private events: EventEmitter,
		private model: Order,
		private contactsView: OrderContactsView,
		private paymentView: OrderPaymentView,
		private successView: OrderSuccessView
	) {
		this.setup();
	}

	/**
	 * Инициализация обработчиков событий процесса оформления заказа.
	 */
	private setup() {
		this.events.on(
			'order:open',
			({ items, total }: { items: ICartItem[]; total: number }) => {
				this.model.setCart(items, total);
				this.paymentView.showModal();
			}
		);

		/**
		 * Обработка события выбора способа оплаты и переход к вводу контактных данных.
		 */
		this.paymentView.onSubmit((data: { payment: string }) => {
			this.model.setPaymentMethod(data.payment);
			this.paymentView.hideModal();
			this.contactsView.showModal();
		});

		/**
		 * Обработка события ввода контактных данных, оформление и отправка заказа.
		 */
		this.contactsView.onSubmit(
			(data: { email: string; phone: string; address: string }) => {
				this.model.setContacts(data.email, data.phone);
				this.model.setAddress(data.address);

				if (this.model.isComplete()) {
					const order = this.model.getData();

					// Имитация отправки заказа
					console.log('[OrderPresenter] Заказ оформлен:', order);
					this.contactsView.hideModal();
					this.successView.render(order.total);
					this.successView.showModal();

					this.model.reset();
					this.events.emit('order:success');
				}
			}
		);
	}
}
