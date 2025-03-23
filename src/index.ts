import './scss/styles.scss';
import { EventEmitter } from "./components/base/events";
import { CatalogView } from "./view/CatalogView";
import { CatalogPresenter } from "./presenter/CatalogPresenter";
import { CatalogApi } from "./model/CatalogApi";
import { ProductModalView } from "./view/ProductModalView";

// 1. События
const eventBus = new EventEmitter();

// 2. Контейнер для карточек
const catalogContainer = document.querySelector(".gallery") as HTMLElement;

const modalView = new ProductModalView(eventBus);

// 3. View + Model + Presenter
const catalogView = new CatalogView(catalogContainer, eventBus);
const catalogModel = new CatalogApi();
const catalogPresenter = new CatalogPresenter(catalogView, catalogModel, eventBus);

// 4. Запуск
catalogPresenter.init();