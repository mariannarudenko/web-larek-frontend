import { Catalog } from '@/model/catalogModel';
import { CatalogView } from '@/view/catalogView';
import { IEvents } from '@/components/base/events';
import { Logger } from '@/utils/logger';
import { IProductCatalog, IFilterableCatalog } from '@/types';

/**
 * Презентер каталога продуктов.
 * Связывает представление с моделью и обрабатывает пользовательские события.
 */
export class CatalogPresenter {
	private catalog = new Catalog();

	constructor(
		private view: CatalogView,
		private model: IProductCatalog & IFilterableCatalog,
		private events: IEvents
	) {}

	/**
	 * Инициализирует каталог: загружает продукты и отображает их.
	 */
	async init() {
		try {
			const products = await this.model.getProducts();
			this.catalog.setProducts(products);
			this.view.render(this.catalog.getAll());
			Logger.info('Каталог инициализирован', { count: products.length });
		} catch (error) {
			Logger.error('Ошибка инициализации каталога', error);
		}

		this.bindEvents();
	}

	/**
	 * Подписывается на пользовательские события.
	 */
	private bindEvents() {
		this.events.on<{ id: string }>('product:select', ({ id }) => {
			const product = this.catalog.getProductById(id);

			if (product) {
				Logger.info('Выбран продукт', { id });
				this.events.emit('modal:open', { product });
			} else {
				Logger.warn('Продукт не найден при выборе', { id });
			}
		});
	}
}
