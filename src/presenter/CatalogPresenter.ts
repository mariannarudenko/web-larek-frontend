import { Cart } from '@/model/cartModel';
import { Catalog } from '@/model/catalogModel';
import { CatalogView } from '@/view/catalogView';
import { IEvents } from '@/components/base/events';
import { Logger } from '@/utils/logger';
import { IProductCatalog, IFilterableCatalog } from '@/types';

/**
 * Презентер каталога продуктов.
 * Отвечает за инициализацию каталога, отображение товаров и обработку пользовательских событий.
 */
export class CatalogPresenter {
	private catalog = new Catalog();

	constructor(
		private view: CatalogView,
		private model: IProductCatalog & IFilterableCatalog,
		private events: IEvents,
		private cart: Cart
	) {}

	/**
	 * Загружает данные каталога и отображает их.
	 */
	async init(): Promise<void> {
		try {
			const products = await this.model.getProducts();
			this.catalog.setProducts(products);
			this.renderCatalog();
			Logger.info('Каталог инициализирован', { count: products.length });
		} catch (error) {
			Logger.error('Ошибка инициализации каталога', error);
		}

		this.bindEvents();
	}

	/**
	 * Обрабатывает события выбора товара и открытия каталога.
	 */
	private bindEvents(): void {
		this.events.on<{ id: string }>('product:select', ({ id }) => {
			const product = this.catalog.getProductById(id);

			if (!product) {
				Logger.warn('Продукт не найден при выборе', { id });
				return;
			}

			Logger.info('Выбран продукт', { id });

			this.events.emit('modal:open', {
				product: {
					...product,
					hasCart: this.cart.hasItem(product.id),
				},
			});
		});

		this.events.on('catalog:open', () => {
			this.renderCatalog();
			Logger.info('Каталог перерендерен после события catalog:open');
		});
	}

	/**
	 * Отображает товары с флагом наличия в корзине.
	 */
	private renderCatalog(): void {
		const products = this.catalog.getAll().map((product) => ({
			...product,
			hasCart: this.cart.hasItem(product.id),
		}));

		this.view.render(products);
	}
}
