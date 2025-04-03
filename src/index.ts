import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { CatalogApi } from './components/base/catalogApi';
import { OrderApi } from '@/components/base/orderApi';
import { ModalView } from '@/view/modalView';

import { CatalogView } from './view/catalogView';
import { CatalogPresenter } from './presenter/catalogPresenter';
import { ProductModalPresenter } from './presenter/productModalPresenter';

import { OrderPresenter } from './presenter/orderPresenter';
import { PaymentModalView } from './view/paymentModalView';
import { ContactsModalView } from '@/view/contactsModalView';
import { SuccessModalView } from './view/successModalView';
import { Order } from './model/orderModel';

import { ProductModalView } from './view/productModalView';
import { CartModalView } from './view/cartModalView';
import { CartListView } from './view/cartListView';
import { CartPresenter } from './presenter/cartPresenter';
import { Cart } from './model/cartModel';

import { CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { Logger } from '@/utils/logger';

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
 * Инициализация корзины.
 */
const cartModalView = new CartModalView(CDN_URL);
const cartListView = new CartListView(cartModalView.getContentElement());
const cartModel = new Cart();
const cartPresenter = new CartPresenter(
	cartModel,
	cartListView,
	cartModalView,
	eventBus
);
Logger.info('Инициализация корзины завершена');

/**
 * Инициализация представления и модели каталога.
 */
const catalogView = new CatalogView(catalogContainer, eventBus);
const catalogModel = new CatalogApi();
const catalogPresenter = new CatalogPresenter(
	catalogView,
	catalogModel,
	eventBus,
	cartModel
);
Logger.info('Инициализация каталога завершена');

/**
 * Инициализация представления модального окна карточки товара.
 */
const productModalView = new ProductModalView(eventBus, CDN_URL);
const productModalPresenter = new ProductModalPresenter(
	productModalView,
	eventBus,
	cartModel
);
Logger.info('Инициализация модального окна продукта завершена');

/**
 * Обработчик клика по иконке корзины.
 * Открывает модальное окно корзины.
 */
document.querySelector('.header__basket')?.addEventListener('click', () => {
	eventBus.emit('cart:open');
	Logger.info('Открытие корзины через иконку');
});

/**
 * Инициализация оформления заказа.
 */
const orderApi = new OrderApi();
const paymentView = new PaymentModalView();
const contactsView = new ContactsModalView();
const successView = new SuccessModalView();
const modal = new ModalView('order');
const orderModel = new Order();

const orderPresenter = new OrderPresenter(
	eventBus,
	orderModel,
	cartModel,
	paymentView,
	contactsView,
	successView,
	modal,
	orderApi
);
Logger.info('Инициализация оформления заказа завершена');

/**
 * Запуск загрузки и отображения каталога.
 */
catalogPresenter.init();
Logger.info('Загрузка и отображение каталога завершены');
