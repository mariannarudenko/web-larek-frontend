import { Api } from "./api";
import { Product } from "../../model/product";
import { Catalog } from "../../model/catalog";
import { ApiListResponse } from "./api";
import { IProductCatalog, IFilterableCatalog } from "../../model/catalog";
import { ProductValidation } from "../../presenter/productValidation";

export class CatalogApi implements IProductCatalog, IFilterableCatalog {
  private catalog = new Catalog();
  private api = new Api(process.env.API_ORIGIN || "https://larek-api.nomoreparties.co");

  async getProducts(): Promise<Product[]> {
    const response = await this.api.get("/api/weblarek/product/") as ApiListResponse<Product>;
    const rawProducts = response.items.map(p =>
      new Product(p.id, p.title, p.description, p.price, p.category, p.image)
    );

    const validProducts = rawProducts.filter(ProductValidation.validate);
    this.catalog.setProducts(validProducts);

    return this.catalog.getAll(); // отдаём только валидные товары
  }

  getProductById(id: string): Product | undefined {
    return this.catalog.getProductById(id);
  }
}