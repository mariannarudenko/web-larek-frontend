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
 * Презентер оформления заказа: связывает все шаги (оплата → контакты → успех).
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
			this.onContactsComplete.bind(this)
		);

		this.setup();
	}

	/**
	 * Подписка на событие начала оформления заказа.
	 */
	private setup() {
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
	 * Обрабатывает завершение первого шага (оплата).
	 */
	private onPaymentComplete() {
		Logger.info('Переход к шагу ввода контактов');

		this.modal.hideModal();
		this.modal.render(this.contactsView);
		this.modal.showModal();
		this.contactsPresenter.init();
	}

	/**
	 * Обрабатывает завершение второго шага (контакты).
	 */
	private async onContactsComplete({
		email,
		phone,
	}: {
		email: string;
		phone: string;
	}) {
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
	 * Показывает финальное сообщение об успешной покупке.
	 */
	private showSuccess(total: number) {
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
	 * Завершает оформление и очищает состояние.
	 */
	private onSuccessClose() {
		Logger.info('Оформление заказа завершено. Сброс данных.');

		// Скрываем все открытые модальные окна
		this.modal.hideModal();

		// Сброс состояния модели и корзины
		this.model.reset();
		this.cart.clear();

		// Сброс состояния всех кнопок на "В корзину"
		this.resetAllProductButtons();

		// Эмитируем события об изменении корзины и открытии каталога
		this.events.emit('cart:changed', []);
		this.events.emit('catalog:open');
	}

	/**
	 * Сбрасывает состояние всех кнопок товаров на "В корзину".
	 */
	private resetAllProductButtons(): void {
		const productCards = document.querySelectorAll('.card');
		productCards.forEach((card) => {
			const button = card.querySelector('.card__button') as HTMLButtonElement;
			button.textContent = 'В корзину'; // сбрасываем текст на "В корзину"
			button.disabled = false; // делаем кнопку доступной
		});

		Logger.info('Состояние кнопок для всех товаров сброшено на "В корзину".');
	}
}
