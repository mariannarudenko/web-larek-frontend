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

## Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/model/ — модели данных: описание товаров, корзина и заказы
- src/view/ — представления (отрисовка интерфейса)
- src/presenter/ — презентеры, которые управляют логикой между моделью и представлением

## Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Описание архитектуры

Проект использует MVP-паттерн для разделения логики и отображения.

### Основные компоненты

- **Model (Модели):** управляют данными и логикой обработки (товары, корзина, заказы).  

- **View (Представления):** отвечают за отрисовку интерфейса и реагируют на события.  

- **Presenter (Контроллеры):** связывают модели и представления, управляют логикой взаимодействий.  

- **EventEmitter:** используется для связи между компонентами.  

- **API-клиент:** получает данные с сервера и преобразует их в удобный формат.  

### Ключевые классы

#### Модели (src/model)
- `Product` — класс полного товара с id, названием, ценой, категорией, изображением и описанием.
- `Cart` — корзина пользователя, хранит добавленные товары, умеет их очищать и возвращать.
- `Order` — оформленный заказ с товарами, общей суммой и контактной информацией.

#### Представления (src/view)
- `CatalogView` — отрисовывает список карточек товара, отправляет события при клике.
- `ProductModalView` — отображает модальное окно с подробной информацией о товаре, добавляет и удаляет товар из корзины.

#### Презентеры (src/presenter)
- `CatalogPresenter` — связывает каталог товаров (модель) с представлением и обрабатывает выбор товара.

## Документация

Код проекта снабжён JSDoc-комментариями.  

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
