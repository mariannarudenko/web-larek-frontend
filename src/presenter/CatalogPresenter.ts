import { CatalogView } from "../view/catalogView";
import { IEvents } from "../components/base/events";
import { IProductCatalog, IFilterableCatalog } from "../model/catalog";

/**
 * Презентер для каталога продуктов.
 * Связывает представление с моделью и обрабатывает пользовательские события.
 */
export class CatalogPresenter {
  /**
   * Создаёт экземпляр презентера каталога.
   * @param {CatalogView} view - Представление каталога.
   * @param {IProductCatalog & IFilterableCatalog} model - Модель, содержащая данные о продуктах.
   * @param {IEvents} events - Система событий для связи между компонентами.
   */
  constructor(
    private view: CatalogView,
    private model: IProductCatalog & IFilterableCatalog,
    private events: IEvents
  ) {}

  /**
   * Инициализирует презентер: загружает продукты, отображает их
   * и настраивает обработчики событий выбора товара.
   */
  async init() {
    const products = await this.model.getProducts();
    this.view.render(products);

    this.events.on<{ id: string }>("product:select", ({ id }) => {
      const product = this.model.getProductById(id);
      if (product) {
        this.events.emit("modal:open", { product });
      }
    });
  }
}
