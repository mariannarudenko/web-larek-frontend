import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { CatalogApi } from './model/catalogApi';

import { CatalogView } from './view/catalogView';
import { CatalogPresenter } from './presenter/catalogPresenter';
import { ProductModalPresenter } from './presenter/productModalPresenter';

import { ProductModalView } from './view/productModalView';
import { CartModalView } from './view/cartModalView';
import { CartListView } from './view/cartListView';
import { CartPresenter } from './presenter/cartPresenter';
import { Cart } from './model/cartModel';

import { OrderContactsView } from './view/orderContactsView';
import { OrderPaymentView } from './view/orderPaymentView';
import { OrderSuccessView } from './view/orderSuccessView';
import { OrderPresenter } from './presenter/orderPresenter';
import { Order } from './model/orderModel';

import { CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

/**
 * Создаёт глобальную событийную шину для взаимодействия между модулями.
 */
const eventBus = new EventEmitter();

/**
 * Получает контейнер для рендеринга каталога.
 */
const catalogContainer = ensureElement<HTMLElement>(
	document.querySelector('.gallery') as HTMLElement
);

/**
 * Инициализация представления модального окна карточки товара.
 */
const productModalView = new ProductModalView(eventBus, CDN_URL);
const productModalPresenter = new ProductModalPresenter(productModalView, eventBus);

/**
 * Инициализация корзины.
 */
const cartModalView = new CartModalView(CDN_URL);
const cartListView = new CartListView(cartModalView.getContentElement());
const cartModel = new Cart();
const cartPresenter = new CartPresenter(cartModel, cartListView, cartModalView, eventBus);

/**
 * Инициализация представления и модели каталога.
 */
const catalogView = new CatalogView(catalogContainer, eventBus);
const catalogModel = new CatalogApi();
const catalogPresenter = new CatalogPresenter(catalogView, catalogModel, eventBus);

/**
 * Инициализация модалок оформления заказа и модели заказа.
 */
const orderContactsView = new OrderContactsView();
const orderPaymentView = new OrderPaymentView();
const orderSuccessView = new OrderSuccessView();
const orderModel = new Order();

const orderPresenter = new OrderPresenter(
	eventBus,
	orderModel,
	orderContactsView,
	orderPaymentView,
	orderSuccessView
);

/**
 * Обработчик клика по иконке корзины.
 * Открывает модальное окно корзины.
 */
document.querySelector('.header__basket')?.addEventListener('click', () => {
	eventBus.emit('cart:open');
});

/**
 * Запуск загрузки и отображения каталога.
 */
catalogPresenter.init();
