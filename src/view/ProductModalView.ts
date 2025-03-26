import { IFullProduct } from "../model/product";
import { IEvents } from "../components/base/events";
import { CDN_URL } from "../utils/constants";
import { BaseView } from "../utils/utils";

/**
 * Представление модального окна с подробной информацией о продукте.
 * Отображает карточку с описанием, обрабатывает добавление/удаление из корзины.
 */
export class ProductModalView extends BaseView {
  /** Элемент модального окна */
  private modalElement: HTMLElement;

  /** Контейнер для содержимого карточки внутри модального окна */
  private contentElement: HTMLElement;

  /** Система событий */
  private events: IEvents;

  /** Текущий отображаемый продукт */
  private currentProduct: IFullProduct | null = null;

  /** Флаг, добавлен ли товар в корзину */
  private isInCart = false;

  /**
   * Создаёт представление модального окна.
   * @param {IEvents} events - Система событий для взаимодействия с другими компонентами.
   * @throws Ошибка, если модальное окно или шаблон карточки не найдены в DOM.
   */
  constructor(events: IEvents) {
    const modal = document.querySelector("#modal-container");
    const template = document.querySelector<HTMLTemplateElement>("#card-preview");

    if (!modal || !(modal instanceof HTMLElement)) throw new Error("Модальное окно не найдено");
    if (!template) throw new Error("Шаблон #card-preview не найден");

    super(template, CDN_URL);

    this.modalElement = modal;
    this.contentElement = modal.querySelector(".modal__content")!;
    this.events = events;

    this.qs(this.modalElement, ".modal__close")?.addEventListener("click", () => {
      this.close();
    });

    this.events.on<{ product: IFullProduct }>("modal:open", ({ product }) => {
      this.render(product);
    });
  }

  /**
   * Отрисовывает карточку продукта в модальном окне.
   * @param {IFullProduct} product - Продукт, который необходимо отобразить.
   * @private
   */
  private render(product: IFullProduct) {
    this.currentProduct = product;

    const card = this.cloneTemplate();

    this.qs(card, ".card__category")!.textContent = product.category;
    this.qs(card, ".card__title")!.textContent = product.title;
    this.qs(card, ".card__text")!.textContent = product.description;
    this.setImage(this.qs(card, ".card__image"), product.image, product.title);
    this.qs(card, ".card__price")!.textContent = this.formatPrice(product.price);

    const button = this.qs(card, ".card__button") as HTMLButtonElement;
    this.isInCart = false;
    this.updateButton(button);

    button.addEventListener("click", () => {
      if (!this.currentProduct) return;

      this.events.emit(
        this.isInCart ? "cart:remove" : "cart:add",
        this.isInCart
          ? { productId: this.currentProduct.id }
          : { product: this.currentProduct }
      );

      this.isInCart = !this.isInCart;
      this.updateButton(button);
    });

    this.contentElement.innerHTML = "";
    this.contentElement.appendChild(card);
    this.modalElement.classList.add("modal_active");
  }

  /**
   * Обновляет текст кнопки в зависимости от состояния товара в корзине.
   * @param {HTMLButtonElement} button - Кнопка, которую нужно обновить.
   * @private
   */
  private updateButton(button: HTMLButtonElement) {
    button.textContent = this.isInCart ? "Убрать" : "В корзину";
  }

  /**
   * Закрывает модальное окно и очищает его содержимое.
   */
  public close() {
    this.modalElement.classList.remove("modal_active");
    this.contentElement.innerHTML = "";
  }
}
