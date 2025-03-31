import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { CatalogApi } from './components/base/catalogApi';

import { CatalogView } from './view/catalogView';
import { CatalogPresenter } from './presenter/catalogPresenter';
import { ProductModalPresenter } from './presenter/productModalPresenter';

import { ProductModalView } from './view/productModalView';
import { CartModalView } from './view/cartModalView';
import { CartListView } from './view/cartListView';
import { CartPresenter } from './presenter/cartPresenter';
import { Cart } from './model/cartModel';
import { OrderModalView } from './view/orderModalView';

import { CDN_URL } from './utils/constants';

/**
 * Создаёт глобальную событийную шину для взаимодействия между модулями.
 */
const eventBus = new EventEmitter();

/**
 * Получает контейнер для рендеринга каталога.
 * @throws Ошибка, если элемент .gallery не найден в DOM.
 */
const catalogContainer = document.querySelector('.gallery') as HTMLElement;
if (!catalogContainer) {
	throw new Error('Не найден элемент .gallery');
}

/**
 * Инициализирует представление модального окна карточки товара.
 */
const productModalView = new ProductModalView(eventBus, CDN_URL);

/**
 * Создаёт презентер модального окна карточки товара.
 * Обрабатывает событие `modal:open` и отображает продукт при успешной валидации.
 */
const productModalPresenter = new ProductModalPresenter(productModalView, eventBus);

/**
 * Инициализирует модальное окно корзины.
 */
const cartModalView = new CartModalView(CDN_URL);

/**
 * Получает контейнер внутри модального окна корзины
 * и создаёт представление списка корзины.
 */
const cartListView = new CartListView(cartModalView.getContentElement());

/**
 * Создаёт модель корзины для хранения состояния.
 */
const cartModel = new Cart();

/**
 * Создаёт презентер корзины и связывает все её компоненты.
 */
const cartPresenter = new CartPresenter(
	cartModel,
	cartListView,
	cartModalView,
	eventBus
);

/**
 * Инициализирует представление и модель каталога.
 */
const catalogView = new CatalogView(catalogContainer, eventBus);
const catalogModel = new CatalogApi();

/**
 * Создаёт презентер каталога и связывает модель с представлением.
 */
const catalogPresenter = new CatalogPresenter(
	catalogView,
	catalogModel,
	eventBus
);

/**
 * Инициализирует модальное окно успешного оформления заказа.
 */
const orderModalView = new OrderModalView();

/**
 * Подписывается на событие успешного оформления заказа и отображает модалку.
 */
eventBus.on('order:success', () => {
	orderModalView.showModal();
});

/**
 * Добавляет обработчик клика по иконке корзины в шапке.
 * Открывает модальное окно корзины.
 */
document.querySelector('.header__basket')?.addEventListener('click', () => {
	eventBus.emit('cart:open');
});

/**
 * Запускает загрузку каталога и рендерит карточки товаров.
 */
catalogPresenter.init();
