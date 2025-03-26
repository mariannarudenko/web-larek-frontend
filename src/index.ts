import './scss/styles.scss';
import { EventEmitter } from "./components/base/events";
import { CatalogView } from "./view/catalogView";
import { CatalogPresenter } from "./presenter/catalogPresenter";
import { CatalogApi } from "./components/base/catalogApi";
import { ProductModalView } from "./view/productModalView";

/**
 * Инициализация событийной шины для обмена сообщениями между компонентами.
 */
const eventBus = new EventEmitter();

/**
 * Получение контейнера для карточек товаров.
 */
const catalogContainer = document.querySelector(".gallery") as HTMLElement;

/**
 * Инициализация модального окна для отображения информации о продукте.
 */
const modalView = new ProductModalView(eventBus);

/**
 * Инициализация MVP-архитектуры: представление, модель, презентер.
 */
const catalogView = new CatalogView(catalogContainer, eventBus);
const catalogModel = new CatalogApi();
const catalogPresenter = new CatalogPresenter(catalogView, catalogModel, eventBus);

/**
 * Запуск приложения: загрузка каталога и отображение продуктов.
 */
catalogPresenter.init();