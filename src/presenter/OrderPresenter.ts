import { Order } from '@/model/orderModel';
import { Cart } from '@/model/cartModel';
import { PaymentModalView } from '@/view/paymentModalView';
import { ContactsModalView } from '@/view/contactsModalView';
import { SuccessModalView } from '@/view/successModalView';
import { ModalView } from '@/view/modalView';

import { PaymentPresenter } from '@/presenter/paymentPresenter';
import { ContactsPresenter } from '@/presenter/contactsPresenter';
import { SuccessPresenter } from '@/presenter/successPresenter';

import { EventEmitter } from '@/components/base/events';
import { Logger } from '@/utils/logger';

import type { ICartItem, IOrderSender } from '@/types';

/**
 * Презентер оформления заказа: связывает шаги оплаты, ввода контактов и подтверждения.
 */
export class OrderPresenter {
	private paymentPresenter: PaymentPresenter;
	private contactsPresenter: ContactsPresenter;
	private successPresenter?: SuccessPresenter;

	constructor(
		private events: EventEmitter,
		private model: Order,
		private cart: Cart,
		private paymentView: PaymentModalView,
		private contactsView: ContactsModalView,
		private successView: SuccessModalView,
		private modal: ModalView,
		private orderApi: IOrderSender
	) {
		this.paymentPresenter = new PaymentPresenter(
			this.model,
			this.paymentView,
			this.onPaymentComplete.bind(this),
			this.events
		);

		this.contactsPresenter = new ContactsPresenter(
			this.model,
			this.contactsView,
			this.onContactsComplete.bind(this),
			this.events
		);

		this.setup();
	}

	/**
	 * Подписывается на событие начала оформления заказа.
	 */
	private setup(): void {
		this.events.on(
			'order:open',
			({ items, total }: { items: ICartItem[]; total: number }) => {
				this.model.setCart(items, total);

				Logger.info('Открыт первый шаг оформления заказа', {
					total,
					itemsCount: items.length,
				});

				this.modal.render(this.paymentView);
				this.modal.showModal();
				this.paymentPresenter.init();
			}
		);
	}

	/**
	 * Обрабатывает переход от оплаты к шагу ввода контактов.
	 */
	private onPaymentComplete(): void {
		Logger.info('Переход к шагу ввода контактов');

		this.modal.hideModal();
		this.modal.render(this.contactsView);
		this.modal.showModal();
		this.contactsPresenter.init();
	}

	/**
	 * Отправляет заказ после ввода контактных данных.
	 */
	private async onContactsComplete({
		email,
		phone,
	}: {
		email: string;
		phone: string;
	}): Promise<void> {
		try {
			this.model.setContacts(email, phone);
			const order = this.model.getData();

			Logger.info('Отправка заказа на сервер', order);
			await this.orderApi.sendOrder(order);

			Logger.info('Заказ успешно отправлен');
			this.showSuccess(order.total);
		} catch (error) {
			Logger.error('Ошибка при отправке заказа', error);
			alert('Не удалось отправить заказ. Попробуйте позже.');
		}
	}

	/**
	 * Отображает экран успешного оформления заказа.
	 */
	private showSuccess(total: number): void {
		Logger.info('Показ экрана успешного оформления заказа', { total });

		this.successPresenter = new SuccessPresenter(
			this.successView,
			total,
			this.onSuccessClose.bind(this)
		);

		this.modal.render(this.successView);
		this.modal.showModal();
		this.successPresenter.init();
	}

	/**
	 * Завершает оформление заказа, очищает состояние и возвращает пользователя к каталогу.
	 */
	private onSuccessClose(): void {
		Logger.info('Оформление заказа завершено. Сброс данных.');

		this.modal.hideModal();

		this.model.reset();
		this.cart.clear();

		this.paymentView.reset();
		this.contactsView.reset();
		this.successView.reset();

		this.events.emit('order:reset');
		this.events.emit('cart:changed', []);
		this.events.emit('catalog:open');
	}
}
