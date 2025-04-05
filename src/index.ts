import './scss/styles.scss';

import { ensureElement } from './utils/utils';
import { Logger } from './services/logger';

import { EventEmitter } from './components/base/events';

import { Cart } from './model/cartModel';
import { Order } from './model/orderModel';
import { CatalogApi } from './model/catalogApi';
import { OrderApi } from './model/orderApi';
import { ProductModel } from './model/productModel';

import { PageView } from './view/page/pageView';
import { CartView } from './view/cart/cartView';
import { CatalogView } from './view/catalog/catalogView';
import { ProductView } from './view/catalog/productView';
import { PaymentView } from './view/order/paymentView';
import { ContactsView } from './view/order/contactsView';
import { SuccessView } from './view/order/successView';
import { ModalManager } from './view/base/modalManager';

import { IBaseProduct } from './types';

/**
 * Глобальная шина событий приложения
 * @type {EventEmitter}
 */
const eventBus = new EventEmitter();

/**
 * Менеджер модальных окон
 * @type {ModalManager}
 */
const modalManager = new ModalManager();

/**
 * Контейнер для рендера каталога
 * @type {HTMLElement}
 */
const gallery = ensureElement<HTMLElement>(
	document.querySelector('.gallery') as HTMLElement
);

/**
 * Модель корзины
 * @type {Cart}
 */
const cart = new Cart();

/**
 * Модель заказа
 * @type {Order}
 */
const order = new Order();

/**
 * API для получения каталога товаров
 * @type {CatalogApi}
 */
const catalogApi = new CatalogApi();

/**
 * API для отправки заказа
 * @type {OrderApi}
 */
const orderApi = new OrderApi();

/**
 * Модель товаров каталога
 * @type {ProductModel}
 */
const productModel = new ProductModel();

/**
 * Представление главной страницы
 * @type {PageView}
 */
const pageView = new PageView();

/**
 * Представление модального окна с карточкой товара
 * @type {ProductView}
 */
const productView = new ProductView({
	eventBus,
	productModel,
	modalManager,
	cart,
});

/**
 * Представление корзины
 * @type {CartView}
 */
const cartView = new CartView(eventBus, modalManager, cart);

/**
 * Представление каталога товаров
 * @type {CatalogView}
 */
const catalogView = new CatalogView(gallery);

/**
 * Представление формы оплаты
 * @type {PaymentView}
 */
const paymentView = new PaymentView({
	eventBus,
	modalManager,
	onNext: (data) => {
		order.setPayment(data);
		eventBus.emit('order:openContacts');
	},
});

/**
 * Представление формы контактов
 * @type {ContactsView}
 */
const contactsView = new ContactsView({
	eventBus,
	modalManager,
	onSubmit: (data) => {
		order.setContacts(data.email, data.phone);
		eventBus.emit('order:submit');
	},
});

/**
 * Представление окна успешного оформления заказа
 * @type {SuccessView}
 */
const successView = new SuccessView({
	eventBus,
	modalManager,
	onClose: () => modalManager.hide(),
});

/**
 * Обработка клика по кнопке корзины в шапке
 * Открывает модальное окно с корзиной
 */
pageView.onCartClick = () => {
	eventBus.emit('cart:open');
};

/**
 * Обработчик добавления товара в корзину
 * @event cart:add
 * @param {IBaseProduct} product - Добавляемый товар
 */
eventBus.on('cart:add', ({ product }: { product: IBaseProduct }) => {
	cart.addItem(product);
	eventBus.emit('cart:changed');
	pageView.updateCartCounter(cart.getTotalCount());
});

/**
 * Обработчик удаления товара из корзины
 * @event cart:remove
 * @param {string} productId - Идентификатор удаляемого товара
 */
eventBus.on('cart:remove', ({ productId }: { productId: string }) => {
	cart.removeItem(productId);
	eventBus.emit('cart:changed');
	pageView.updateCartCounter(cart.getTotalCount());
});

/**
 * Обработчик отправки заказа
 * @event order:submit
 */
eventBus.on('order:submit', () => {
	try {
		const userData = order.getData();
		const items = cart.getItems().map((item) => item.product.id);
		const total = cart.getTotalPrice();

		const orderData = {
			...userData,
			items,
			total,
		};

		orderApi
			.sendOrder(orderData)
			.then(() => {
				successView.setTotal(total);
				cart.clear();
				order.reset();
				pageView.updateCartCounter(cart.getTotalCount());
				eventBus.emit('cart:changed');
				eventBus.emit('order:reset');
				eventBus.emit('order:success');
			})
			.catch((error: unknown) => {
				Logger.error('Ошибка при оформлении заказа', error);
			});
	} catch (err) {
		Logger.error('Ошибка валидации данных заказа', err);
	}
});

/**
 * Загрузка и отображение каталога товаров при старте приложения
 * @async
 */
(async () => {
	try {
		const fetchedProducts = await catalogApi.fetchProducts();
		productModel.setProducts(fetchedProducts);

		catalogView.render(
			productModel.getProducts().map((product) => ({
				...product,
				hasCart: cart.hasItem(product.id),
			}))
		);

		Logger.info('Каталог загружен', { count: fetchedProducts.length });

		catalogView.bindCardClicks((id) => {
			eventBus.emit('product:select', { id });
		});
	} catch (error) {
		Logger.error('Ошибка загрузки каталога', error);
	}
})();
