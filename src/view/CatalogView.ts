import { ICatalogProduct } from "@/types";
import { IEvents } from "@/components/base/events";
import { CDN_URL } from "@/utils/constants";
import { BaseView } from "@/utils/utils";

/**
 * Представление каталога товаров.
 */
export class CatalogView extends BaseView {
  constructor(
    private container: HTMLElement,
    private events: IEvents
  ) {
    const template = document.querySelector<HTMLTemplateElement>("#card-catalog");
    if (!template) throw new Error("Шаблон #card-catalog не найден");
    super(template, CDN_URL);
  }

  /**
   * Очищает контейнер перед рендерингом.
   */
  public clear() {
    this.container.innerHTML = "";
  }

  /**
   * Создает и возвращает карточку продукта.
   */
  private createCard(product: ICatalogProduct): HTMLElement {
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

    return card;
  }

  /**
   * Отрисовывает список товаров в контейнере.
   */
  public render(products: ICatalogProduct[]) {
    this.clear();
    products.forEach((product) => {
      this.container.appendChild(this.createCard(product));
    });
  }
}