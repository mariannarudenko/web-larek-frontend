/**
 * Централизованный презентер
 */

import './scss/styles.scss';

// Сервисы
import { Logger } from './services/logger';

// Утилиты и события
import { EventEmitter } from './components/base/events';
import { EVENTS } from './utils/constants';

// Модели
import { Cart } from './model/cartModel';
import { Order } from './model/orderModel';
import { CatalogApi } from './model/catalogApi';
import { OrderApi } from './model/orderApi';
import { ProductModel } from './model/productsModel';

// Представления
import { PageView } from './view/page/pageView';
import { CartView } from './view/cart/cartView';
import { CartItemView } from './view/cart/cartItemView';
import { CatalogView } from './view/catalog/catalogView';
import { ProductView } from './view/catalog/productView';
import { PaymentView } from './view/order/paymentView';
import { ContactsView } from './view/order/contactsView';
import { SuccessView } from './view/order/successView';
import { ModalManager } from './view/base/modalManager';

// Типы
import { IBaseProduct } from './types';

/* ----------------------------- Инициализация ----------------------------- */

/** @type {EventEmitter} Глобальная шина событий приложения */
const eventBus = new EventEmitter();

/** @type {ModalManager} Менеджер модальных окон */
const modalManager = new ModalManager();

/** @type {Cart} Модель корзины */
const cart = new Cart();

/** @type {Order} Модель заказа */
const order = new Order();

/** @type {CatalogApi} API каталога */
const catalogApi = new CatalogApi();

/** @type {OrderApi} API заказов */
const orderApi = new OrderApi();

/** @type {ProductModel} Модель товаров */
const productModel = new ProductModel();

/* ---------------------------- Представления ----------------------------- */

const pageView = new PageView();
const productView = new ProductView();
const cartView = new CartView();
const catalogView = new CatalogView();
const paymentView = new PaymentView();
const contactsView = new ContactsView();
const successView = new SuccessView();

/* -------------------------- Обработчики View ---------------------------- */

/**
 * Обработка отправки формы контактов
 */
contactsView.setOnSubmit((data) => {
	order.setContacts(data.email, data.phone);
	eventBus.emit(EVENTS.ORDER_SUBMIT);
});

/**
 * Обработка переключения статуса товара (в корзине / нет)
 */
productView.setOnToggle((id, inCart) => {
	if (inCart) {
		const product = productModel.getProductById(id);
		if (product) {
			eventBus.emit(EVENTS.CART_ADD, { product });
		}
	} else {
		eventBus.emit(EVENTS.CART_REMOVE, { productId: id });
	}
});

/**
 * Обработка перехода к контактам после выбора способа оплаты
 */
paymentView.setOnNext((data: { payment: string; address: string }) => {
	order.setPayment(data);
	eventBus.emit(EVENTS.ORDER_OPEN_CONTACTS);
});

/**
 * Обработка клика по кнопке "Оформить заказ" в корзине
 */
cartView.setOnCheckout(() => {
	eventBus.emit(EVENTS.ORDER_OPEN_PAYMENT);
});

/**
 * Закрытие окна успешного оформления заказа
 */
successView.setOnClose(() => {
	modalManager.hide();
});

/**
 * Клик по иконке корзины в шапке
 */
pageView.setOnCartClick(() => {
	eventBus.emit(EVENTS.CART_OPEN_CLICK);
});


/* --------------------------- Обработка событий -------------------------- */

/**
 * Выбор товара в каталоге
 */
eventBus.on<{ id: string }>(EVENTS.PRODUCT_SELECT, ({ id }) => {
	const product = productModel.getProductById(id);
	if (!product) return;

	const isValid = product.title.trim().length > 0 && (product.price === null || product.price > 0);
	if (!isValid) {
		Logger.warn('Невалидный продукт', product);
		return;
	}

	productModel.setCurrent(product);
	const hasCart = cart.hasItem(product.id);
	const element = productView.render({ ...product, hasCart });

	modalManager.setContent(element);
	modalManager.show();
});

/**
 * Показ модального окна корзины
 */
eventBus.on(EVENTS.CART_OPEN_CLICK, () => {
	eventBus.emit(EVENTS.CART_OPEN);
});

/**
 * Отображение корзины
 */
eventBus.on(EVENTS.CART_OPEN, () => {
	renderCartView({ showModal: true });
	modalManager.show();
});

/**
 * Добавление товара в корзину
 * @param {IBaseProduct} product
 */
eventBus.on(EVENTS.CART_ADD, ({ product }: { product: IBaseProduct }) => {
	cart.addItem(product);
	eventBus.emit(EVENTS.CART_CHANGED);
	pageView.updateCartCounter(cart.getTotalCount());
});

/**
 * Удаление товара из корзины
 * @param {string} productId
 */
eventBus.on(EVENTS.CART_REMOVE, ({ productId }: { productId: string }) => {
	cart.removeItem(productId);
	eventBus.emit(EVENTS.CART_CHANGED);
	pageView.updateCartCounter(cart.getTotalCount());
});

/**
 * Обновление кнопки товара при изменении корзины
 */
eventBus.on(EVENTS.CART_CHANGED, () => {
	const current = productModel.getCurrent();
	if (!current || !modalManager.isVisible()) return;
	productView.updateButton(cart.hasItem(current.id));
});

/**
 * Отображение формы оплаты
 */
eventBus.on(EVENTS.ORDER_OPEN_PAYMENT, () => {
	paymentView.resetFields();
	modalManager.setContent(paymentView.render());
	modalManager.show();
});

/**
 * Отображение формы контактов
 */
eventBus.on(EVENTS.ORDER_OPEN_CONTACTS, () => {
	contactsView.resetFields();
	modalManager.setContent(contactsView.getElement());
	modalManager.show();
});


/**
 * Обработка отправки заказа
 */
eventBus.on(EVENTS.ORDER_SUBMIT, async () => {
	try {
		const userData = order.getData();
		const items = cart.getItems().map((item) => item.product.id);
		const total = cart.getTotalPrice();

		await orderApi.sendOrder({ ...userData, items, total });

		successView.setTotal(total);
		cart.clear();
		cartView.clear();
		order.reset();
		pageView.updateCartCounter(0);

		eventBus.emit(EVENTS.CART_CHANGED);
		eventBus.emit(EVENTS.ORDER_RESET);
		eventBus.emit(EVENTS.ORDER_SUCCESS);
	} catch (error) {
		Logger.error('Ошибка при оформлении заказа', error);
	}
});

/**
 * Показ окна успешного оформления
 */
eventBus.on(EVENTS.ORDER_SUCCESS, () => {
	modalManager.setContent(successView.getElement());
	modalManager.show();
});

/* ------------------------- Вспомогательные функции ------------------------ */

/**
 * Рендер корзины и установка содержимого
 * @param {{ showModal?: boolean }} options
 */
function renderCartView({ showModal = false } = {}): void {
	const items = cart.getItems();
	const totalPrice = cart.getTotalPrice();

	const views = items.map((item, i) => {
		const view = new CartItemView(
			cartView.getItemTemplate(),
			item,
			i,
			(id) => eventBus.emit(EVENTS.CART_REMOVE, { productId: id })
		);
		return view.render();
	});

	cartView.setItems(views);
	cartView.setTotal(totalPrice);

	if (showModal) {
		modalManager.setContent(cartView.render());
	}
}

/* ------------------------ Загрузка данных при старте ---------------------- */

(async () => {
	try {
		const fetchedProducts = await catalogApi.fetchProducts();
		productModel.setProducts(fetchedProducts);

		const productsWithCart = productModel.getProducts().map((product) => ({
			...product,
			hasCart: cart.hasItem(product.id),
		}));

		catalogView.render(productsWithCart);

		Logger.info('Каталог загружен', { count: fetchedProducts.length });

		catalogView.onCardSelect((id) => {
			eventBus.emit(EVENTS.PRODUCT_SELECT, { id });
		});
	} catch (error) {
		Logger.error('Ошибка загрузки каталога', error);
	}
})();
