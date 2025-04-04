/**
 * Точка входа приложения: инициализация моделей, представлений, подписка на события и запуск бизнес-логики.
 * Включает логику отображения каталога, корзины и оформления заказа.
 * Выполняет роль презентора.
 */

/**
 * Точка входа приложения: инициализация моделей, представлений, подписка на события и запуск бизнес-логики.
 * Включает логику отображения каталога, корзины и оформления заказа.
 */

import './scss/styles.scss';

import { ProductView } from './view/catalog/productView';

import { Cart } from './model/cartModel';
import { Order } from './model/orderModel';
import { CatalogApi } from './model/catalogApi';
import { OrderApi } from './model/orderApi';

import { CartView } from './view/cart/cartView';
import { CartItemView } from './view/cart/cartItemView';

import { CatalogView } from './view/catalog/catalogView';

import { PaymentView } from './view/order/paymentView';
import { ContactsView } from './view/order/contactsView';
import { SuccessView } from './view/order/successView';
import { ModalManager } from './view/base/modalManager';

import { EventEmitter } from './components/base/events';
import { Logger } from './services/logger';
import { ensureElement } from './utils/utils';

import { IBaseProduct, IFullProduct } from './types';

/* ============================================================================
   #1. Инициализация
============================================================================ */
const eventBus = new EventEmitter();

const gallery = ensureElement<HTMLElement>(
	document.querySelector('.gallery') as HTMLElement
);

const cart = new Cart();
const order = new Order();
const catalogApi = new CatalogApi();
const orderApi = new OrderApi();

const cartView = new CartView();
const catalogView = new CatalogView(gallery);
const paymentView = new PaymentView();
const contactsView = new ContactsView();
const successView = new SuccessView();
const modalManager = new ModalManager();
const productView = new ProductView(eventBus);

let currentProduct: IFullProduct | undefined = undefined;
let products: IFullProduct[] = [];

/* ============================================================================
   #2. Слушатели событий (EventBus)
============================================================================ */
eventBus.on('cart:changed', () => {
	if (!currentProduct || !modalManager.isVisible()) return;
	const hasCart = cart.hasItem(currentProduct.id);
	productView.updateButton(hasCart);
});

eventBus.on<{ id: string }>('product:select', ({ id }) => {
	const product = products.find((p) => p.id === id);
	if (!product) return;

	const hasValidTitle = product.title.trim().length > 0;
	const hasValidPrice = product.price === null || product.price > 0;
	if (!hasValidTitle || !hasValidPrice) {
		Logger.warn('Невалидный продукт', product);
		return;
	}

	currentProduct = product;

	const hasCart = cart.hasItem(product.id);
	const productElement = productView.render({ ...product, hasCart });

	modalManager.setContent(productElement);
	modalManager.show();
});

eventBus.on('cart:add', ({ product }: { product: IBaseProduct }) => {
	cart.addItem(product);
	eventBus.emit('cart:changed');
	updateCartCounter();
});

eventBus.on('cart:remove', ({ productId }: { productId: string }) => {
	cart.removeItem(productId);
	eventBus.emit('cart:changed');
	updateCartCounter();
});

eventBus.on('cart:open', () => {
	renderCart();
	modalManager.show();
});

cartView.onCheckout(() => {
	eventBus.emit('order:open', {
		items: cart.getItems().map((item) => item.product),
		total: cart.getTotalPrice(),
	});
});

eventBus.on<{ items: IBaseProduct[]; total: number }>(
	'order:open',
	({ items, total }) => {
		order.setCart(items, total);
		paymentView.reset();
		modalManager.setContent(paymentView.getElement());
		modalManager.show();
		initPaymentStep();
	}
);

/* ============================================================================
   #3. Функции отображения
============================================================================ */

/**
 * Отображает содержимое корзины.
 */
function renderCart() {
	const items = cart.getItems();
	const totalPrice = cart.getTotalPrice();

	const itemTemplate =
		document.querySelector<HTMLTemplateElement>('#card-basket')!;
	const views = items.map((item, i) => {
		const view = new CartItemView(itemTemplate, item, i);
		const el = view.render();

		el.querySelector('.basket__item-delete')?.addEventListener('click', () => {
			Logger.info('Удаление товара из корзины (UI)', { id: item.product.id });
			cart.removeItem(item.product.id);
			eventBus.emit('cart:changed');
			updateCartCounter();
			renderCart();
		});

		return el;
	});

	const cartElement = cartView.render();
	cartView.setItems(views);
	cartView.setTotal(totalPrice);
	modalManager.setContent(cartElement);
}

/**
 * Обновляет счётчик товаров в иконке корзины.
 */
function updateCartCounter() {
	const counter = document.querySelector('.header__basket-counter');
	if (counter) {
		counter.textContent = String(cart.getTotalCount());
	}
}

/**
 * Привязывает обработчики кликов к карточкам товаров.
 */
function bindProductCardClickEvents() {
	gallery.querySelectorAll('.card').forEach((el) => {
		const id = el.getAttribute('data-id');
		if (id) {
			el.addEventListener('click', () => {
				Logger.info('Выбрана карточка товара', { id });
				eventBus.emit('product:select', { id });
			});
		}
	});
}

/**
 * Показывает окно успешного оформления заказа.
 * @param {number} total - Общая сумма заказа
 */
function showSuccess(total: number) {
	successView.reset();

	const successElement = successView.getElement();
	successView.setTotal(total);
	modalManager.setContent(successElement);
	modalManager.show();

	successView.getCloseButton().addEventListener('click', () => {
		modalManager.hide();
		order.reset();
		cart.clear();
		updateCartCounter();

		paymentView.reset();
		contactsView.reset();
		successView.reset();
		eventBus.emit('order:reset');
		eventBus.emit('cart:changed');

		catalogApi.fetchProducts().then((products) => {
			catalogView.render(
				products.map((product) => ({
					...product,
					hasCart: cart.hasItem(product.id),
				}))
			);
			bindProductCardClickEvents();
		});
	});
}

/* ============================================================================
   #4. Шаги оформления заказа
============================================================================ */

/**
 * Инициализирует шаг выбора способа оплаты и адреса.
 */
function initPaymentStep() {
	paymentView.resetFields();

	paymentView.getPaymentButtons().forEach((btn) => {
		btn.addEventListener('click', () => {
			paymentView
				.getPaymentButtons()
				.forEach((b) => b.classList.remove('button_alt-active'));
			btn.classList.add('button_alt-active');
			const method = btn.getAttribute('name');
			if (method) order.setPaymentMethod(method);
			updateNextState();
		});
	});

	paymentView.getAddressInput().addEventListener('input', () => {
		const input = paymentView.getAddressInput();
		const address = input.value.trim();
		order.setAddress(address);
		updateNextState();
	});

	paymentView.getNextButton().addEventListener('click', (e) => {
		e.preventDefault();
		modalManager.hide();
		contactsView.reset();
		modalManager.setContent(contactsView.getElement());
		modalManager.show();
		initContactsStep();
	});

	function updateNextState() {
		const address = paymentView.getAddressInput().value.trim();
		const hasPayment = !!paymentView.getSelectedPaymentMethod();
		paymentView.setNextButtonEnabled(!!address && hasPayment);
	}
}

/**
 * Инициализирует шаг ввода контактов.
 */
function initContactsStep() {
	contactsView.resetFields();

	const emailInput = contactsView.getEmailInput();
	const phoneInput = contactsView.getPhoneInput();
	const submitButton = contactsView.getSubmitButton();

	const update = () => {
		const email = emailInput.value.trim();
		const phone = phoneInput.value.trim();
		contactsView.setSubmitEnabled(!!email && !!phone);
	};

	emailInput.addEventListener('input', update);
	phoneInput.addEventListener('input', update);

	submitButton.addEventListener('click', async (e) => {
		e.preventDefault();

		const email = emailInput.value.trim();
		const phone = phoneInput.value.trim();

		order.setContacts(email, phone);
		const orderData = order.getData();
		showSuccess(orderData.total);
	});
}

/* ============================================================================
   #5. Инициализация каталога
============================================================================ */
catalogApi.fetchProducts().then((fetchedProducts) => {
	products = fetchedProducts;

	catalogView.render(
		products.map((product) => ({
			...product,
			hasCart: cart.hasItem(product.id),
		}))
	);

	Logger.info('Каталог загружен', { count: products.length });
	bindProductCardClickEvents();
});

/* ============================================================================
   #6. DOM-события
============================================================================ */
document.querySelector('.header__basket')?.addEventListener('click', () => {
	eventBus.emit('cart:open');
});
