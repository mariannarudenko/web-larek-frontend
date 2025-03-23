import { Api } from "../components/base/api";
import { Product } from "./Product";
import { Catalog } from "./Catalog";
import { ApiListResponse } from "../components/base/api";

export class CatalogApi {
  private catalog = new Catalog();
  private api = new Api(process.env.API_ORIGIN || "https://larek-api.nomoreparties.co");

  async getProducts(): Promise<Product[]> {
    const response = await this.api.get("/api/weblarek/product/") as ApiListResponse<Product>;
    const products = response.items.map(p =>
      new Product(p.id, p.title, p.description, p.price, p.category, p.image)
    );
    this.catalog.setProducts(products);
    return products;
  }

  getProductById(id: string): Product | undefined {
    return this.catalog.getProductById(id);
  }
}