import { CatalogView } from "../view/CatalogView";
import { Product } from "../model/Product";
import { IEvents } from "../components/base/events";


// Интерфейс каталога
export interface IProductCatalog {
  setProducts(products: Product[]): void;
}

// Интерфейс фильтруемого каталога
export interface IFilterableCatalog {
  getProductById(id: string): Product | undefined;
}

// Класс каталога
export class Catalog implements IProductCatalog, IFilterableCatalog {
  private products: Product[] = [];

  setProducts(products: Product[]): void {
    this.products = products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }
}

export class CatalogPresenter {
  constructor(
    private view: CatalogView,
    private model: { getProducts(): Promise<Product[]>; getProductById(id: string): Product },
    private events: IEvents
  ) {}

  async init() {
    const products = await this.model.getProducts();
    this.view.render(products);

    this.events.on<{ id: string }>("product:select", ({ id }) => {
      const product = this.model.getProductById(id);
      this.events.emit("modal:open", { product });
    });
  }
}