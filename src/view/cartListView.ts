import type { ICartItem } from '@/types';

/**
 * Представление списка корзины, отвечающее за рендеринг и управление товарами.
 */
export class CartListView {
  /** @protected @type {HTMLElement} Контейнер списка корзины. */
  protected container: HTMLElement;
  /** @protected @type {HTMLTemplateElement} Шаблон корзины. */
  protected template: HTMLTemplateElement;
  /** @protected @type {HTMLTemplateElement} Шаблон элемента корзины. */
  protected itemTemplate: HTMLTemplateElement;

  /** @protected @type {(id: string) => void} Обработчик удаления товара. */
  protected removeHandler: (id: string) => void = () => {};
  /** @protected @type {() => void} Обработчик оформления заказа. */
  protected checkoutHandler: () => void = () => {};

  /**
   * @param {HTMLElement} container - Контейнер, в котором будет рендериться корзина.
   */
  constructor(container: HTMLElement) {
    this.container = container;
    this.template = document.getElementById('basket') as HTMLTemplateElement;
    this.itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
  }

  /**
   * Отображает список товаров в корзине.
   * @param {ICartItem[]} items - Массив товаров в корзине.
   * @param {number} total - Общая стоимость товаров.
   */
  render(items: ICartItem[], total: number) {

    this.container.innerHTML = '';
    const basketNode = this.template.content.cloneNode(true) as HTMLElement;
    const list = basketNode.querySelector('.basket__list')!;
    const totalPrice = basketNode.querySelector('.basket__price')!;
    const checkoutBtn = basketNode.querySelector('.basket__button')!;

    items.forEach((item, index) => {
      const itemNode = this.itemTemplate.content.cloneNode(true) as HTMLElement;
      const li = itemNode.querySelector('.basket__item')!;
      li.setAttribute('data-id', item.product.id);
      
      itemNode.querySelector('.basket__item-index')!.textContent = `${index + 1}`;
      itemNode.querySelector('.card__title')!.textContent = item.product.title;
      itemNode.querySelector('.card__price')!.textContent = `${item.product.price ?? 'бесценно'} синапсов`;

      itemNode.querySelector('.basket__item-delete')!.addEventListener('click', () => {
        this.removeHandler(item.product.id);
      });

      list.appendChild(itemNode);
    });

    totalPrice.textContent = `${total} синапсов`;
    checkoutBtn.addEventListener('click', () => this.checkoutHandler());
    this.container.appendChild(basketNode);
  }

  /**
   * Устанавливает обработчик удаления товара из корзины.
   * @param {(id: string) => void} handler - Функция-обработчик удаления товара.
   */
  onRemove(handler: (id: string) => void) {
    this.removeHandler = handler;
  }

  /**
   * Устанавливает обработчик оформления заказа.
   * @param {() => void} handler - Функция-обработчик оформления заказа.
   */
  onCheckout(handler: () => void) {
    this.checkoutHandler = handler;
  }

  /**
   * Обновляет счетчик товаров в корзине.
   * @param {number} count - Новое количество товаров в корзине.
   */
  updateCounter(count: number) {
    const counter = document.querySelector('.header__basket-counter');
    if (counter) counter.textContent = String(count);
  }
}