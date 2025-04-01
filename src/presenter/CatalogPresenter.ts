import { CatalogView } from '@/view/catalogView';
import { IEvents } from '@/components/base/events';
import { IProductCatalog, IFilterableCatalog } from '@/types';
import { Catalog } from '@/model/catalogModel';
import { Logger } from '@/utils/logger';

/**
 * Презентер для каталога продуктов.
 * Связывает представление с моделью и обрабатывает пользовательские события.
 */
export class CatalogPresenter {
	/** Локальный каталог продуктов */
	private catalog = new Catalog();

	/**
	 * Создаёт экземпляр презентера каталога.
	 * @param {CatalogView} view - Представление каталога.
	 * @param {IProductCatalog & IFilterableCatalog} model - Источник данных.
	 * @param {IEvents} events - Система событий.
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
		try {
			const products = await this.model.getProducts();
			this.catalog.setProducts(products);
			this.view.render(this.catalog.getAll());
		} catch (error) {
			Logger.error('Ошибка инициализации каталога', error);
		}

		this.events.on<{ id: string }>('product:select', ({ id }) => {
			const product = this.catalog.getProductById(id);
			if (product) {
				this.events.emit('modal:open', { product });
			}
		});
	}
}
