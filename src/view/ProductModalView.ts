import { IFullProduct } from "../model/Product";
import { IEvents } from "../components/base/events";
import { CDN_URL } from '../utils/constants';

export class ProductModalView {
  private modalElement: HTMLElement;
  private contentElement: HTMLElement;
  private events: IEvents;
  private template: HTMLTemplateElement;
  private currentProduct: IFullProduct | null = null;
  private isInCart = false;

  constructor(events: IEvents) {
    const modal = document.querySelector("#modal-container");
    const template = document.querySelector<HTMLTemplateElement>("#card-preview");

    if (!modal || !(modal instanceof HTMLElement)) throw new Error("Модальное окно не найдено");
    if (!template) throw new Error("Шаблон #card-preview не найден");

    this.modalElement = modal;
    this.contentElement = modal.querySelector(".modal__content")!;
    this.events = events;
    this.template = template;

    this.modalElement.querySelector(".modal__close")?.addEventListener("click", () => {
      this.close();
    });

    this.events.on<{ product: IFullProduct }>("modal:open", ({ product }) => {
      this.render(product);
    });
  }

  private render(product: IFullProduct) {
    this.currentProduct = product;

    const card = this.template.content.cloneNode(true) as HTMLElement;

    const category = card.querySelector(".card__category");
    const title = card.querySelector(".card__title");
    const description = card.querySelector(".card__text");
    const image = card.querySelector(".card__image");
    const price = card.querySelector(".card__price");
    const button = card.querySelector(".card__button") as HTMLButtonElement;

    if (category) category.textContent = product.category;
    if (title) title.textContent = product.title;
    if (description) description.textContent = product.description;
    if (image instanceof HTMLImageElement) {
      image.src = `${CDN_URL}/${product.image}`;
      image.alt = product.title;
    }
    if (price) {
      price.textContent = product.price !== null
        ? `${product.price} синапсов`
        : "Бесценно";
    }
    this.isInCart = false; 
    this.updateButton(button);

    button.addEventListener("click", () => {
      if (!this.currentProduct) return;

      if (this.isInCart) {
        this.events.emit("cart:remove", { productId: this.currentProduct.id });
        this.isInCart = false;
      } else {
        this.events.emit("cart:add", { product: this.currentProduct });
        this.isInCart = true;
      }

      this.updateButton(button);
    });

    this.contentElement.innerHTML = "";
    this.contentElement.appendChild(card);
    this.modalElement.classList.add("modal_active");
  }

  private updateButton(button: HTMLButtonElement) {
    button.textContent = this.isInCart ? "Убрать" : "В корзину";
  }

  public close() {
    this.modalElement.classList.remove("modal_active");
    this.contentElement.innerHTML = "";
  }
}