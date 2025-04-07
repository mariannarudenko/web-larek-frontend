# Проектная работа "Веб-ларёк" 

📚 [Открыть документацию →](https://mariannarudenko.github.io/web-larek-frontend/)

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

- `src/` — исходные файлы проекта  
- `src/components/` — переиспользуемые компоненты (например, EventEmitter, Api)  
- `src/components/base/` — базовые абстракции (BaseView, Api, EventEmitter)  
- `src/model/` — бизнес-логика и работа с данными (каталог, корзина, заказ)  
- `src/view/` — представления пользовательского интерфейса  
- `src/view/base/` — модуль управления модальными окнами  
- `src/services/` — сервисы (например, логгер)  
- `src/utils/` — утилиты и константы  
- `src/types/` — типы и интерфейсы  
- `src/pages/` — HTML-шаблоны страниц  
- `src/scss/` — SCSS-стили  
- `src/public/` — публичные ресурсы (изображения, иконки, шрифты)

## Важные файлы:

- `src/index.ts` — главный презентер и точка входа  
- `src/pages/index.html` — HTML шаблон главной страницы  
- `src/utils/constants.ts` — константы  
- `src/utils/utils.ts` — утилиты  
- `src/view/base/baseView.ts` — базовый класс для представлений  
- `src/view/base/modalManager.ts` — управление модальными окнами 
- `webpack.config.js` — конфигурация Webpack  

## Архитектурный подход

Архитектура проекта основана на паттерне **MVP (Model-View-Presenter)**. Презентер связывает представления и модели, обрабатывая пользовательские действия и обновляя UI. 
Все коммуникации реализованы через **событийную модель** (EventEmitter).

---

## Слой МОДЕЛИ

### Класс `Cart`
**Назначение:** Хранит данные о товарах в корзине и предоставляет методы управления ими.

**Поля:**
- `items` — массив объектов с данными о товарах в корзине (id, название, цена).

**Методы:**
- `getItems()` — возвращает все товары в корзине.
- `hasItem(id)` — проверяет наличие товара по ID.
- `addItem(product)` — добавляет товар.
- `removeItem(id)` — удаляет товар.
- `clear()` — очищает корзину.
- `getTotalCount()` — возвращает количество товаров.
- `getTotalPrice()` — возвращает суммарную цену.

### Класс `Order`
**Назначение:** Отвечает за пошаговое накопление данных заказа: адрес, способ оплаты, контакты.

**Поля:**
- `payment` — способ оплаты.
- `address` — адрес доставки.
- `email` — контактный email.
- `phone` — номер телефона.

**Методы:**
- `setPayment({ payment, address })` — сохраняет способ оплаты и адрес.
- `setContacts(email, phone)` — сохраняет контакты.
- `isComplete()` — проверяет, заполнены ли все поля.
- `getData()` — возвращает финальный заказ.
- `reset()` — сбрасывает все поля.

---

## Слой ПРЕДСТАВЛЕНИЯ

### Класс `CatalogView`
**Назначение:** Отображение каталога товаров.

**Поля:**
- Контейнер с карточками товаров.

**Методы:**
- `render(products)` — отображает карточки.
- `onCardSelect(callback)` — обрабатывает клики по товарам.

### Класс `ProductView`
**Назначение:** Представление одной карточки товара.

**Поля:**
- DOM-элемент карточки товара.
- Кнопка добавления/удаления из корзины.

**Методы:**
- `render(product)` — создаёт и возвращает карточку товара.
- `updateButton(hasCart)` — обновляет текст кнопки в зависимости от статуса товара в корзине.
- `setOnToggle(callback)` — устанавливает обработчик переключения состояния товара в корзине.

### Класс `CartView`
**Назначение:** Представление корзины с товарами.

**Поля:**
- Список товаров.
- Итоговая сумма.
- Кнопка оформления заказа.

**Методы:**
- `setItems(items)` — вставляет карточки товаров.
- `setTotal(total)` — отображает сумму.
- `render()` — возвращает DOM корзины.
- `clear()` — очищает содержимое корзины.
- `setOnCheckout(callback)` — устанавливает обработчик оформления заказа.

### Класс `CartItemView`
**Назначение:** Отображение одного элемента в корзине.

**Поля:**
- DOM-элемент строки корзины (название, цена, кнопка удаления).

**Методы:**
- `render()` — возвращает DOM-элемент товара.

### Класс `PaymentView`
**Назначение:** Форма выбора способа оплаты и ввода адреса.

**Поля:**
- Кнопки выбора оплаты.
- Поле ввода адреса.
- Кнопка перехода на следующий шаг.

**Методы:**
- `render()` — возвращает DOM-форму.
- `resetFields()` — очищает форму.
- `getSelectedPaymentMethod()` — возвращает выбранный способ оплаты.
- `setNextButtonEnabled(enabled)` — активирует/деактивирует кнопку.
- `setOnNext(callback)` — устанавливает обработчик перехода к следующему шагу.

### Класс `ContactsView`
**Назначение:** Ввод email и телефона для оформления заказа.

**Поля:**
- Поля email и телефона.
- Кнопка отправки заказа.

**Методы:**
- `getElement()` — возвращает DOM-элемент формы.
- `resetFields()` — очищает поля.
- `setSubmitEnabled(enabled)` — активирует/деактивирует кнопку отправки.
- `setOnSubmit(callback)` — устанавливает обработчик отправки формы.

### Класс `SuccessView`
**Назначение:** Показывает сообщение об успешном оформлении заказа.

**Поля:**
- DOM-элемент окна.
- Кнопка закрытия.

**Методы:**
- `getElement()` — возвращает DOM окна.
- `setTotal(total)` — показывает списанную сумму.
- `setOnClose(callback)` — устанавливает обработчик закрытия.

### Класс `ModalManager`
**Назначение:** Управляет отображением модального окна.

**Поля:**
- Обёртка модального окна.
- Контейнер для контента.

**Методы:**
- `show()` — показывает окно.
- `hide()` — скрывает окно.
- `setContent(element)` — вставляет контент.
- `reset()` — очищает окно.
- `isVisible()` — проверяет видимость.
- `onClose(callback)` — задаёт обработчик закрытия.

---

## Слой ПРЕЗЕНТЕРА

### Главный модуль `index.ts`
**Назначение:** Централизованное управление событиями и координация между слоями.

- Все события обрабатываются через `EventEmitter`
- Презентер не реализован отдельным классом, а централизован в `index.ts`

---

## Событийная модель: пример взаимодействия

### Сценарий: пользователь оформляет заказ

#### 1. View реагирует на действия пользователя и вызывает колбэк
**Класс:** `PaymentView`  
**Метод:** `setOnNext(callback)`  
**Действие:** пользователь выбирает способ оплаты и вводит адрес

```ts
paymentView.setOnNext((data) => {
  order.setPayment(data);
  eventBus.emit(EVENTS.ORDER_OPEN_CONTACTS);
});
```

#### 2. Презентер обновляет модель
**Место:** `index.ts`

```ts
public setPayment(data: { payment: string; address: string }): void {
  this.payment = data.payment;
  this.address = data.address;
  Logger.info('Данные оплаты установлены', data);
}
```

#### 3. Презентер эмитит событие перехода к следующему шагу 
**Событие:** `EVENTS.ORDER_OPEN_CONTACTS`
**Описание:** инициирует показ формы с контактными данными

```ts
eventBus.on(EVENTS.ORDER_OPEN_CONTACTS, () => {
  contactsView.resetFields();
  modalManager.setContent(contactsView.getElement());
  modalManager.show();
});
```

#### 4. View перерисовывается
**Класс:** `ContactsView`  
**Метод:** `resetFields()` — очищает поля перед показом

---

## Документирование

Проект снабжён JSDoc-комментариями. 
Для генерации документации используется [TypeDoc](https://typedoc.org/).

- Сгенерированная документация доступна в `/docs`
- Команда: `npm run docs`

---

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
