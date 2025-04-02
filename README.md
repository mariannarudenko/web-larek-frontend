# Проектная работа "Веб-ларёк" 

## "Веб-ларёк" – это интернет-магазин товаров для веб-разработчиков. В нём можно:

- Просматривать каталог товаров.  
- Добавлять товары в корзину.  
- Оформлять заказ.  

## Стек:

- **Язык:** TypeScript  
- **Разметка и стили:** HTML, SCSS  
- **Сборщик:** Webpack  
- **Управление состоянием:** EventEmitter  
- **Архитектурный паттерн:** MVP (Model-View-Presenter)  
- **Документирование:** JSDoc

## Структура проекта:
- src/ — все исходные файлы проекта
- src/components/ — переиспользуемые JS-компоненты
- src/components/base/ — базовые абстрактные компоненты (например, BaseView)
- src/model/ — модели данных (работа с API, корзиной, товарами и заказами)
- src/view/ — отображение интерфейса и реакция на действия пользователя
- src/presenter/ — логика связывания моделей и представлений
- src/utils/ — вспомогательные функции, логгер и константы
- src/types/ — типизация (интерфейсы и типы данных)
- src/pages/ — HTML-шаблоны страниц
- src/scss/ — стили проекта
- src/public/ — статические ресурсы (изображения, шрифты и т.п.)

## Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/index.ts — точка входа приложения
- src/types/index.ts — центральный файл экспорта типов и моделей
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
- src/view/modalView.ts - базовый класс для представления модального окна
- src/utils/logger.ts - утилита для логирования сообщений с разными уровнями важности
- webpack.config.js — конфигурация сборки проекта

## Описание архитектуры

Проект использует MVP-паттерн для разделения логики и отображения. Архитектура проекта спроектирована с учётом масштабируемости — шаги оформления заказа, представления и модели могут расширяться независимо друг от друга. Каждый класс выполняет строго одну задачу (SRP), а взаимодействия между модулями реализовано через события. Повторяющийся код вынесен в базовые классы и утилиты, отсутствует жесткое связывание между слоями. 

### Основные компоненты

- **Model (Модели):** управляют данными и логикой обработки (товары, корзина, заказы).  

- **View (Представления):** отвечают за отрисовку интерфейса и реагируют на события.  

- **Presenter (Контроллеры):** связывают модели и представления, управляют логикой взаимодействий.  

- **EventEmitter:** используется для связи между компонентами.  

- **API-клиент:** получает данные с сервера и преобразует их в удобный формат.  

### Ключевые классы

#### Модели (src/model)
- `productModel.ts` — данные товара, текущее превью
- `catalogModel.ts` — каталог продуктов, реализует хранение, фильтрацию и доступ к товарам
- `cartModel.ts` — управление корзиной (добавление, удаление, подсчёты)
- `orderModel.ts` — оформление заказа (почта, адрес, оплата)
- `catalogApi.ts` / `orderApi.ts` — взаимодействие с API

#### Представления (src/view)
- `catalogView.ts` — отображение списка товаров
- `productView.ts` / `productModalView.ts` — карточки и модалки товаров
- `cartListView.ts` / `cartModalView.ts` — список и модальное окно корзины
- `contactsModalView.ts` — форма ввода email/телефона
- `paymentModalView.ts` — выбор способа оплаты и адреса
- `successModalView.ts` — окно успешного заказа
- `modalView.ts` — базовый модуль модального окна

#### Презентеры (src/presenter)
- `catalogPresenter.ts` — управление каталогом товаров
- `productModalPresenter.ts` — отображение карточки в модалке
- `cartPresenter.ts` — синхронизация корзины
- `paymentPresenter.ts` — управление шагом выбора способа оплаты
- `contactsPresenter.ts` — управление шагом с email/телефоном
- `orderPresenter.ts` — финализация заказа
- `successPresenter.ts` — показ финального окна
- `productValidation.ts` — валидация форм заказа

### Валидаторы и утилиты
- `utils.ts` — вспомогательные функции
- `constants.ts` — строковые и числовые константы
- `logger.ts` — логирование
- `productValidation.ts` — проверка данных заказа

#### Типы данных (src/types)
- `product.ts` — описание товара
- `cart.ts` — структура корзины
- `order.ts` — данные заказа
- `modal.ts` — типы для модальных окон
- `catalog.ts` — данные каталога
- `index.ts` — корневой файл экспорта типов

## Документация
- docs/ - код проекта снабжён JSDoc-комментариями и самодокументируется

## Описание базовых классов
 
#### Класс Api (components/base/api.ts) 
##### Базовый класс для работы с API.
##### Методы:
- get(uri: string) — выполняет GET-запрос и возвращает данные в формате JSON.
- post(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE') — отправка данных на сервер.
- handleResponse(response) — обрабатывает ответ сервера, включая ошибки.

#### Класс EventEmitter (components/base/events.ts)
##### Классическая реализация брокера событий на основе паттерна "Наблюдатель".
##### Методы:
- on(event, callback) — подписка на событие.
- off(event, callback) — отписка от события.
- emit(event, data) — вызов события.
- onAll(callback) — подписка на все события.
- offAll() — отписка от всех событий.
- trigger(eventName, context?) — возвращает функцию, которая вызывает событие с переданным контекстом.

#### Класс BaseView (utils/utils.ts - внутри файла)
##### Абстрактный класс представлений. Содержит универсальные методы работы с DOM, шаблонами и отображением.
##### Методы:
- cloneTemplate() — клонирует шаблон.
- qs(root, selector) — сокращённый метод поиска элементов.
- setImage(img, src, alt) — установка изображения.
- formatPrice(price) — форматирует цену (100 → "100 синапсов").
- show(element) / hide(element) — показать/скрыть элемент.
- bindEvents(element, events) — универсальный метод подписки на события.

#### Класс ModalView (view/modalView.ts)
##### Базовый класс для отображения модальных окон. Наследуется от BaseView.
##### Особенности:
- Принимает ID HTML-шаблона и рендерит его содержимое в контейнер #modal-container.
- Позволяет вставлять произвольные View в модальное окно через render(view).
- Поддерживает автоматическое закрытие по кнопке и фону.
##### Методы:
- render(view) — рендер представления в модалку.
- showModal() / hideModal() — показать/скрыть модалку.
- setupCloseHandlers() — вешает обработчики на .modal__close и фон.

## Описание классов Model

#### Класс Cart (cartModel.ts)
##### Модель корзины пользователя. Позволяет управлять товарами: добавлять, удалять, очищать и получать информацию.
##### Методы:
- getItems() — получить все товары.
- hasItem(id) — проверить наличие товара.
- addItem(product) — добавить товар.
- removeItem(id) — удалить товар.
- clear() — очистить корзину.
- getTotalCount() — количество товаров.
- getTotalPrice() — общая сумма заказа.

#### Класс Catalog (catalogModel.ts)
##### Каталог товаров. Хранит, фильтрует и предоставляет доступ к товарам.
##### Методы:
- getProducts() — получить список продуктов.
- setProducts(products) — установить и отфильтровать валидные продукты.
- getProductById(id) — найти продукт по ID.
- getAll() — вернуть весь каталог.

#### Класс Order (orderModel.ts)
##### Модель оформления заказа. Позволяет поэтапно накапливать данные и собрать финальный заказ.
##### Методы:
- setCart(items, total) — передать товары и сумму заказа.
- setAddress(address) — установить адрес доставки.
- setPaymentMethod(method) — выбрать способ оплаты.
- setContacts(email, phone) — установить контакты.
- isComplete() — проверить полноту данных.
- getData() — собрать заказ в структуру ICompletedOrder.
- reset() — сбросить заказ.

#### Класс Product (productModel.ts)
##### Модель полного продукта.
##### Конструктор принимает:
- id — идентификатор
- title — название
- description — описание
- price — цена (может быть null)
- category — категория
- image — ссылка на изображение

## Описание классов View
## Описание классов Presenter

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
