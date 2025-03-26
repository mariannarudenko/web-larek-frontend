import { ICatalogProduct } from "../model/product";
import { IEvents } from "../components/base/events";
import { CDN_URL } from "../utils/constants";
import { BaseView } from "../utils/utils";

/**
 * Представление каталога товаров.
 * Отвечает за отрисовку карточек продуктов и обработку кликов.
 */
export class CatalogView extends BaseView {
  /**
   * Создаёт экземпляр представления каталога.
   * @param {HTMLElement} container - Контейнер, в который будут отрисованы карточки.
   * @param {IEvents} events - Система событий для связи с другими компонентами.
   * @throws Ошибка, если шаблон #card-catalog не найден в DOM.
   */
  constructor(
    private container: HTMLElement,
    private events: IEvents
  ) {
    const template = document.querySelector<HTMLTemplateElement>("#card-catalog");
    if (!template) throw new Error("Шаблон #card-catalog не найден");
    super(template, CDN_URL);
  }

  /**
   * Отрисовывает список продуктов в контейнере.
   * @param {ICatalogProduct[]} products - Список продуктов для отображения.
   */
  public render(products: ICatalogProduct[]) {
    this.container.innerHTML = "";

    products.forEach((product) => {
      const card = this.cloneTemplate();

      this.qs(card, ".card__category")!.textContent = product.category;
      this.qs(card, ".card__title")!.textContent = product.title;
      this.setImage(this.qs(card, ".card__image"), product.image, product.title);
      this.qs(card, ".card__price")!.textContent = this.formatPrice(product.price);

      const clickable = this.qs(card, ".card");
      if (clickable) {
        clickable.setAttribute("data-id", product.id);
        clickable.addEventListener("click", () => {
          this.events.emit("product:select", { id: product.id });
        });
      }

      this.container.appendChild(card);
    });
  }
}
