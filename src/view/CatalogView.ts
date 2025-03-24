import { ICatalogProduct } from "../model/Product";
import { IEvents } from "../components/base/events";
import { CDN_URL } from '../utils/constants';


export class CatalogView {
  private container: HTMLElement;
  private events: IEvents;
  private template: HTMLTemplateElement;

  constructor(container: HTMLElement, events: IEvents) {
    this.container = container;
    this.events = events;

    const tmpl = document.querySelector<HTMLTemplateElement>("#card-catalog");
    if (!tmpl) throw new Error("Template #card-catalog not found");
    this.template = tmpl;
  }

  render(products: ICatalogProduct[]) {
    this.container.innerHTML = "";

    products.forEach(product => {
      const card = this.template.content.cloneNode(true) as HTMLElement;

      const category = card.querySelector(".card__category");
      const title = card.querySelector(".card__title");
      const image = card.querySelector(".card__image");
      const price = card.querySelector(".card__price");
      const button = card.querySelector(".card");

      if (category) category.textContent = product.category;
      if (title) title.textContent = product.title;
      if (image instanceof HTMLImageElement) {
        image.src = `${CDN_URL}/${product.image}`;
        image.alt = product.title;
      }
      if (price) {
        price.textContent = product.price !== null
          ? `${product.price} синапсов`
          : "Бесценно";
      }
      if (button) {
        button.setAttribute("data-id", product.id);
        button.addEventListener("click", () => {
          this.events.emit("product:select", { id: product.id });
        });
      }

      this.container.appendChild(card);
    });
  }
}

