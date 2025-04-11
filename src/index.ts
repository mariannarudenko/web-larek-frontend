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
const cart = new Cart(eventBus);

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
 * Реакция на ввод оплаты и адреса.
 * Валидируем данные через модель и активируем кнопку, если они корректны.
 */
paymentView.setOnInput(() => {
	const payment = paymentView.getSelectedPaymentMethod();
	const address = paymentView['addressInput']?.value?.trim() || '';

	if (!payment && !address) return;

	order.setPayment({ payment: payment || '', address });

	const isValid = order.validatePayment();
	const errors = {
		isValid,
		payment: !payment ? 'Выберите способ оплаты' : undefined,
		address: !address ? 'Введите адрес доставки' : undefined,
	};

	eventBus.emit(EVENTS.ORDER_VALIDATE_PAYMENT, errors);
});


/**
 * Обработка перехода к контактам после выбора способа оплаты
 */
paymentView.setOnNext((data: { payment: string; address: string }) => {
	eventBus.emit(EVENTS.ORDER_PAYMENT_SUBMITTED, data);
});

/**
 * Реакция на ввод в поля email и phone.
 * Валидируем данные через модель и активируем кнопку, если они корректны.
 */
contactsView.setOnInput(({ email, phone }) => {
	const trimmedEmail = email?.trim() || '';
	const trimmedPhone = phone?.trim() || '';

	if (!trimmedEmail && !trimmedPhone) return;

	order.setContacts({ email: trimmedEmail, phone: trimmedPhone });

	const isValid = order.validateContacts();

	const errors = {
		isValid,
		email: !trimmedEmail ? 'Введите email' : undefined,
		phone: !trimmedPhone ? 'Введите телефон' : undefined,
	};

	eventBus.emit(EVENTS.ORDER_VALIDATE_CONTACTS, errors);
});

/**
 * Обработка отправки формы контактов
 */
contactsView.setOnSubmit((data: { email: string; phone: string }) => {
	eventBus.emit(EVENTS.ORDER_CONTACTS_SUBMITTED, data);
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

	const isValid =
		product.title.trim().length > 0 &&
		(product.price === null || product.price > 0);
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
	eventBus.emit(EVENTS.HAS_CART_CHANGED);
	eventBus.emit(EVENTS.CART_CHANGED);
});

/**
 * Удаление товара из корзины
 * @param {string} productId
 */
eventBus.on(EVENTS.CART_REMOVE, ({ productId }: { productId: string }) => {
	cart.removeItem(productId);
	eventBus.emit(EVENTS.HAS_CART_CHANGED);
	eventBus.emit(EVENTS.CART_CHANGED);
});

/**
 * Обновление корзины при изменении корзины
 */
eventBus.on(EVENTS.CART_CHANGED, () => {
	cart.getTotalPrice();
	pageView.updateCartCounter(cart.getTotalCount());
	renderCartView();
});

/**
 * Обновление кнопки товара при изменении корзины
 */
eventBus.on(EVENTS.HAS_CART_CHANGED, () => {
	const current = productModel.getCurrent();
	if (!current || !modalManager.isVisible()) return;
	productView.updateButton(cart.hasItem(current.id));
});

/**
 * Открытие формы оплаты
 * Сбрасывает поля и отображает PaymentView в модальном окне
 */
eventBus.on(EVENTS.ORDER_OPEN_PAYMENT, () => {
	paymentView.resetFields();
	modalManager.setContent(paymentView.render());
	modalManager.show();
});

/**
 * Ошибка валидации оплаты и адреса
 */
eventBus.on<{ payment?: string; address?: string; isValid: boolean }>(
	EVENTS.ORDER_VALIDATE_PAYMENT,
	(errors) => {
		paymentView.updateValidationState(errors);
	}
);

/**
 * Открытие формы контактов
 * Сбрасывает поля и отображает ContactsView в модальном окне
 */
eventBus.on(EVENTS.ORDER_OPEN_CONTACTS, () => {
	contactsView.resetFields();
	modalManager.setContent(contactsView.getElement());
	modalManager.show();
});

/**
 * Ошибка валидации контактов
 */
eventBus.on<{ email?: string; phone?: string; isValid: boolean }>(
	EVENTS.ORDER_VALIDATE_CONTACTS,
	(errors) => {
		contactsView.updateValidationState(errors);
	}
);

/**
 * Обработка отправки платёжной информации
 * Валидирует и сохраняет данные в модель заказа
 * В случае успеха — открывает форму ввода контактов
 * В случае ошибки — эмитит ORDER_VALIDATION_ERROR
 */
eventBus.on<{ payment: string; address: string }>(
	EVENTS.ORDER_PAYMENT_SUBMITTED,
	() => {
		if (!order.validatePayment()) {
			eventBus.emit(EVENTS.ORDER_VALIDATION_ERROR, { field: 'payment' });
			return;
		}
		eventBus.emit(EVENTS.ORDER_OPEN_CONTACTS);
	}
);

/**
 * Обработка отправки контактной информации
 * Валидирует и сохраняет данные в модель заказа
 * В случае успеха — запускает финальную отправку заказа
 * В случае ошибки — эмитит ORDER_VALIDATION_ERROR
 */
eventBus.on<{ email: string; phone: string }>(
	EVENTS.ORDER_CONTACTS_SUBMITTED,
	async () => {
		if (!order.validateContacts()) {
			eventBus.emit(EVENTS.ORDER_VALIDATION_ERROR, { field: 'contacts' });
			return;
		}
		await submitOrder();
	}
);

/**
 * Отображение окна успешного оформления заказа
 * Показывает SuccessView в модальном окне
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
		const view = new CartItemView(cartView.getItemTemplate(), item, i, (id) =>
			eventBus.emit(EVENTS.CART_REMOVE, { productId: id })
		);
		return view.render();
	});

	cartView.setItems(views);
	cartView.setTotal(totalPrice);

	if (showModal) {
		modalManager.setContent(cartView.render());
	}
}

/**
 * Финализирует оформление заказа.
 * @returns {Promise<void>} Асинхронная операция отправки заказа.
 */
async function submitOrder(): Promise<void> {
	try {
		const userData = order.getData(); // выбросит ошибку, если заказ не полон
		const items = cart.getItems().map((item) => item.product.id);
		const total = cart.getTotalPrice();

		await orderApi.sendOrder({ ...userData, items, total });

		successView.setTotal(total);
		cart.clear();
		cartView.clear();
		order.reset();
		pageView.updateCartCounter(0);

		eventBus.emit(EVENTS.HAS_CART_CHANGED);
		eventBus.emit(EVENTS.ORDER_RESET);
		eventBus.emit(EVENTS.ORDER_SUCCESS);
	} catch (error) {
		Logger.error('Ошибка при оформлении заказа', error);
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
