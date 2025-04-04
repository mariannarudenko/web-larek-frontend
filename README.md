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
- **Документирование:** JSDoc, TypeDoc

## Структура проекта:

- src/ — все исходные файлы проекта
- src/components/ — переиспользуемые JS-компоненты
- src/components/base/ — базовые абстрактные компоненты (например, BaseView)
- src/model/ — модели данных (работа с API, корзиной, товарами и заказами)
- src/view/ — отображение интерфейса и реакция на действия пользователя
- src/services/ - сервис логгирования
- src/utils/ — вспомогательные функции и константы
- src/types/ — типизация (интерфейсы и типы данных)
- src/pages/ — HTML-шаблоны страниц
- src/scss/ — стили проекта
- src/public/ — статические ресурсы (изображения, шрифты и т.п.)

## Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/index.ts — точка входа приложения, презентер
- src/types/index.ts — центральный файл экспорта типов и моделей
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
- src/view/base/baseView.ts - Предоставляет общие методы работы с DOM и шаблонами
- src/view/base/modalManager.ts - управляет показом, скрытием, контентом и колбэками модалки
- src/services/logger.ts - утилита для логирования сообщений с разными уровнями важности
- webpack.config.js — конфигурация сборки проекта

## Описание архитектуры

Проект построен на паттерне MVP: логика и отображение разделены. Каждый компонент отвечает за одну задачу (SRP), модули общаются через EventEmitter, что делает архитектуру гибкой и масштабируемой.

### Основные компоненты

- **Model (Модели):** управляют данными и логикой обработки (товары, корзина, заказы).  

- **View (Представления):** отвечают за отрисовку интерфейса и реагируют на события.  

- **Presenter (Контроллеры):** связывают модели и представления, управляют логикой взаимодействий.  

- **EventEmitter:** используется для связи между компонентами.  

- **API-клиент:** получает данные с сервера и преобразует их в удобный формат.  

## Пример взаимодействия по MVP: оформление заказа
### Цель: пользователь выбирает способ оплаты и вводит адрес, чтобы перейти к следующему шагу оформления заказа, а затем — вводит email и телефон, чтобы завершить оформление.

1. View (PaymentView)

Пользователь:

  - выбирает способ оплаты, нажимая на одну из кнопок;
  - вводит адрес доставки в текстовое поле.

2. View:

  - обновляет визуальное состояние кнопок;
  - вызывает методы setPaymentMethod и setAddress модели Order;
  - активирует кнопку "Далее", если оба поля заполнены.

2. Model (Order)

Методы setPaymentMethod и setAddress сохраняют выбранный метод оплаты и введённый адрес. Модель заказа накапливает данные поэтапно.

3. Контроллер (index.ts)

  - При клике на кнопку "Далее" проверяется валидность полей и вызывается следующий шаг.
  - Отображается ContactsView (форма ввода email и телефона).
  - Кнопка "Далее" становится доступной, только если оба поля непустые.

4. View (ContactsView)

Пользователь вводит email и телефон. View:

  - активирует кнопку "Оформить заказ", если оба поля заполнены;
  - вызывает методы setContacts модели Order при клике на кнопку;
  - модель сохраняет email и телефон, проверяет полноту данных;
  - если все данные валидны, вызывается order.getData().

5. Model + Контроллер

  - Модель Order собирает все данные и возвращает ICompletedOrder.
  - Вместо отправки на сервер вызывается showSuccess(total) — отображается окно успешного заказа.
  - После закрытия окна:

    - заказ и корзина сбрасываются;
    - обновляется счётчик корзины;
    - перезагружается каталог.

### Ключевые классы

#### Api (src/model)

- `catalogApi.ts` — загрузка каталога товаров с сервера
- `orderApi.ts` — отправка завершённого заказа на сервер

#### Модели (src/model)

- `catalogModel.ts` — хранение и поиск товаров
- `cartModel.ts` — управление корзиной (добавление, удаление, подсчёты)
- `orderModel.ts` — пошаговое накопление данных оформления заказа

#### Представления (src/view)

- `catalogView.ts` — отображение карточек товаров
- `productView.ts` — карточка товара с кнопкой добавления в корзину
- `cartView.ts` — отображение корзины с товарами и итоговой суммой
- `cartItemView.ts` — отдельный элемент в корзине
- `paymentView.ts` — выбор способа оплаты и адреса доставки
- `contactsView.ts` — ввод email и телефона
- `successView.ts` — окно успешного заказа

#### Централизованная логика (src/index.ts)

- `index.ts` - вся логика взаимодействия между моделью, представлением и событиями реализована в одном централизованном модуле 

### Утилиты и вспомогательные модули

- `utils.ts` — вспомогательные функции
- `constants.ts` — строковые и числовые константы
- `logger.ts` — логирование
- `baseView.ts` — базовый класс представления с шаблонными методами
- `modalManager.ts` — модуль управления модальным окном

#### Типы данных (src/types)

- `product.ts` — описание товара
- `cart.ts` — структура корзины
- `order.ts` — данные заказа
- `modal.ts` — типы для модальных окон
- `catalog.ts` — данные каталога
- `index.ts` — корневой файл экспорта типов

## Документация

Проект снабжён подробными JSDoc-комментариями.  
Для генерации документации используется [TypeDoc](https://typedoc.org/).

- Сгенерированная документация доступна в папке `/docs`.
- Команда для генерации:

```
npm run docs
```


## Описание базовых классов
 
#### Класс Api (components/base/api.ts) 
##### Базовый класс для работы с API.
##### Методы:

- get(uri: string) — выполняет GET-запрос и возвращает данные в формате JSON.
- post(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE') — отправка данных на сервер.
- handleResponse(response: Response): Promise<unknown> — обрабатывает ответ от сервера, выбрасывает ошибку при !response.ok.

#### Класс CatalogApi (model/catalogApi.ts)
##### Класс, реализующий загрузку и валидацию каталога товаров.  Использует Api для получения данных, ProductValidation — для фильтрации, и сохраняет валидные товары в Catalog.
##### Методы:

- fetchProducts(): Promise<IFullProduct[]> — получает список товаров с API, логирует успех или ошибку.

#### Класс OrderApi (model/orderApi.ts)
##### Сервис для отправки заказа на сервер. Принимает данные заказа, валидирует наличие данных и использует Api для POST-запроса.
##### Методы:

- sendOrder(order: ICompletedOrder): Promise<object> — отправляет заказ на сервер и логирует результат.

#### Класс EventEmitter (components/base/events.ts)
##### Классическая реализация брокера событий на основе паттерна "Наблюдатель".
##### Методы:

- on(event, callback) — подписка на событие.
- off(event, callback) — отписка от события.
- emit(event, data) — вызов события.
- onAll(callback) — подписка на все события.
- offAll() — отписка от всех событий.
- trigger(eventName, context?) — возвращает функцию, которая вызывает событие с переданным контекстом.

#### Класс BaseView (src/view/base/baseView.ts)
##### Абстрактный класс представлений. Содержит универсальные методы работы с DOM, шаблонами и отображением.
##### Методы:

- cloneTemplate() — клонирует шаблон.
- qs(root, selector) — сокращённый метод поиска элементов.
- setImage(img, src, alt) — установка изображения.
- formatPrice(price) — форматирует цену (100 → "100 синапсов").
- show(element) / hide(element) — показать/скрыть элемент.
- bindEvents(element, events) — универсальный метод подписки на события.

## Описание классов Model

#### Класс Cart  (src/model/cartModel.ts)
##### Модель корзины пользователя. Отвечает за хранение, добавление и удаление товаров, а также расчёт общей суммы и количества.
##### Методы:

-  getItems(): ICartItem[] — возвращает список всех товаров в корзине.
-  hasItem(id: string): boolean — проверяет, добавлен ли товар с указанным ID.
-  addItem(product: IBaseProduct): void — добавляет товар, если его ещё нет.
-  removeItem(id: string): void — удаляет товар по ID.
-  clear(): void — очищает корзину.
-  getTotalCount(): number — возвращает количество товаров в корзине.
-  getTotalPrice(): number — рассчитывает суммарную стоимость всех товаров.

#### Класс Catalog (src/model/catalogModel.ts)
##### Каталог товаров. Хранит полный список продуктов и позволяет находить товары по ID.
##### Методы:

- setProducts(products: IFullProduct[]): void — сохраняет список продуктов в каталог.
- getProducts(): IFullProduct[] — возвращает все товары.
- getProductById(id: string): IFullProduct | undefined — ищет товар по ID и логирует результат.

#### Класс Order (src/model/orderModel.ts)
##### Модель оформления заказа. Служит для поэтапного накопления данных (товары, адрес, способ оплаты, контакты) и финальной сборки заказа.
##### Методы:

- setCart(products: IBaseProduct[], total: number): void — сохраняет ID товаров и общую сумму заказа.
- setAddress(address: string): void — устанавливает адрес доставки.
- setPaymentMethod(method: string): void — выбирает способ оплаты.
- setContacts(email: string, phone: string): void — сохраняет email и телефон.
- isComplete(): boolean — проверяет, заполнены ли все обязательные поля.
- getData(): ICompletedOrder — возвращает собранный заказ (или выбрасывает ошибку, если не всё заполнено).
- reset(): void — сбрасывает все поля заказа до начального состояния.

## Описание классов View

#### Класс CatalogView (src/view/catalog/catalogView.ts)
##### Представление каталога товаров. Рендерит карточки товаров в указанный контейнер.
##### Методы:

- render(products: ICatalogProduct[]): void — очищает контейнер и отображает список карточек.
- clear(): void — удаляет все карточки из DOM.
- createCard(product): HTMLElement — создаёт DOM-элемент карточки с категорией, изображением, ценой и id.

#### Класс ProductView (src/view/catalog/productView.ts)
##### Карточка товара с кнопкой "В корзину". Обрабатывает логику добавления/удаления товара через EventEmitter.
##### Методы:

- render(product: IFullProduct & { hasCart: boolean }): HTMLElement - отображает карточку, навешивает логику добавления в корзину.
- updateButton(button, hasCart) - обновляет текст кнопки в зависимости от того, в корзине ли товар.

#### Класс CartView (src/view/cart/cartView.ts)
##### Основное представление корзины. Содержит список товаров, общую сумму и кнопку "Оформить заказ".
##### Методы:

- render(): HTMLElement — возвращает отрендеренный DOM корзины.
- setItems(items: HTMLElement[]): void — вставляет отрендеренные карточки товаров в список.
- setTotal(total: number): void — обновляет итоговую сумму и активность кнопки.
- onCheckout(cb: () => void): void — навешивает колбэк на кнопку оформления.

#### Класс CartItemView (src/view/cart/cartItemView.ts)
##### Представление одного элемента корзины. Отвечает только за отображение.
##### Методы:

- render(): HTMLElement — создаёт DOM-элемент для товара (индекс, название, цена).

#### Класс PaymentView (src/view/order/paymentView.ts)
##### Форма выбора способа оплаты и ввода адреса. Работает с DOM напрямую: кнопки оплаты, поле адреса, кнопка "Далее".
##### Методы:

- getElement(): HTMLElement — создаёт и возвращает DOM формы, инициализирует поля.
- reset(): void — сбрасывает DOM (для пересоздания).
- resetFields(): void — очищает значения и сбрасывает кнопки.
- getPaymentButtons(): HTMLButtonElement[] — возвращает кнопки оплаты.
- getAddressInput(): HTMLInputElement — поле адреса.
- getNextButton(): HTMLButtonElement — кнопка перехода на следующий шаг.
- getSelectedPaymentMethod(): string | null — возвращает выбранный способ оплаты.
- setNextButtonEnabled(enabled: boolean): void — активирует/деактивирует кнопку.

#### Класс ContactsView (src/view/order/contactsView.ts)
##### Форма ввода email и телефона. Предоставляет доступ к полям формы и кнопке отправки.
##### Методы:

- getElement(): HTMLElement — создаёт и возвращает DOM-элемент формы.
- reset(): void — удаляет сохранённый DOM, пересоздаёт при следующем вызове.
- resetFields(): void — очищает поля и отключает кнопку.
- getEmailInput(): HTMLInputElement — доступ к полю email.
- getPhoneInput(): HTMLInputElement — доступ к полю телефона.
- getSubmitButton(): HTMLButtonElement — доступ к кнопке отправки.
- setSubmitEnabled(enabled: boolean): void — включение/выключение кнопки.

#### Класс SuccessView (src/view/order/successView.ts)
##### Окно с сообщением об успешном заказе и итоговой суммой.
##### Методы:

- мgetElement(): HTMLElement — возвращает DOM окна, пересоздаёт при необходимости.
- reset(): void — сбрасывает DOM.
- setTotal(total: number): void — устанавливает итоговую сумму (Списано N синапсов).
- getCloseButton(): HTMLButtonElement — возвращает кнопку закрытия.

#### Класс ModalManager (src/view/base/modalManager.ts)
##### Менеджер модального окна. Управляет показом, скрытием и подстановкой контента в модалку.
##### Методы:

- show(): void — показывает модальное окно.
- hide(): void — скрывает модальное окно и вызывает onClose.
- setContent(element: HTMLElement): void — устанавливает контент модального окна.
- reset(): void — очищает содержимое модального окна.
- isVisible(): boolean — проверяет, открыта ли модалка.
- onClose(callback: () => void): void — назначает обработчик закрытия.

## Описание логических блоков Presenter (реализовано в index.ts)

#### ProductSelection — логика выбора товара
##### Роль:

- обрабатывает выбор товара из каталога, отображает карточку в модалке.

##### Функции и поведение:

- Подписка на событие product:select:

  - ищет товар по id;
  - проверяет валидность (title, price);
  - вызывает productView.render(...);
  - отображает карточку в ModalManager.

- Подписка на cart:changed: обновляет кнопку "В корзину" на открытой карточке товара.

#### CartControl — логика управления корзиной
##### Роль: 

- синхронизирует модель Cart и представления CartView, CartItemView, счётчик в шапке.

#### Функции и поведение:

- cart:add и cart:remove: добавляют/удаляют товары, обновляют представление и счётчик.
- cart:open: вызывает renderCart() и отображает модалку с корзиной.
- renderCart():

  - создаёт список элементов через CartItemView;
  - отображает итоговую сумму;
  - навешивает обработчики удаления;
  - инициализирует кнопку "Оформить заказ".

#### OrderFlow — логика оформления заказа
##### Роль:

- управляет всеми шагами оформления — от корзины до окна успеха.

##### Функции и поведение:

1. initPaymentStep()

- Отображает PaymentView.
- Навешивает события на:

  - кнопки выбора оплаты;
  - поле адреса;
  - кнопку "Далее".

- Проверяет, активна ли кнопка для перехода к следующему шагу.

2. initContactsStep()

- Отображает ContactsView.
- Навешивает обработчики на поля email и телефона.
- Активирует кнопку "Оформить", если поля непустые.
- При подтверждении:

  - сохраняет данные в Order;
  - вызывает order.getData() и showSuccess(total).

3. showSuccess(total)

- Показывает SuccessView, передаёт сумму.
- При закрытии:

  - очищает корзину (Cart.clear()), заказ (Order.reset()), представления (reset() каждого);
  - сбрасывает счётчик;
  - заново загружает каталог;
  - эмиттит order:reset, cart:changed.

#### EventBinding — маршрутизатор событий
##### Роль: 

- настраивает глобальные подписки на события через EventEmitter.

##### Обрабатываемые события:

- product:select
- cart:add, cart:remove, cart:open, cart:changed
- order:open, order:reset

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
