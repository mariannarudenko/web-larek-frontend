import { CatalogView } from "../view/CatalogView";
import { Product } from "../model/Product";
import { Catalog } from "../model/Catalog";
import { IEvents } from "../components/base/events";

export class CatalogPresenter {
  constructor(
    private view: CatalogView,
    private model: Catalog,
    private events: IEvents
  ) {}

  async init() {
    const products = this.model.getAll();
    this.view.render(products);

    this.events.on<{ id: string }>("product:select", ({ id }) => {
      const product = this.model.getProductById(id);
      if (product) {
        this.events.emit("modal:open", { product });
      }
    });
  }
}