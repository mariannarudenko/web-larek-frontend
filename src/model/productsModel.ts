import { IFullProduct } from '@/types';

/**
 * Модель управления продуктами.
 * Хранит список всех продуктов и текущий выбранный продукт.
 */
export class ProductModel {
	private products: IFullProduct[] = [];
	private current?: IFullProduct;

	/**
	 * Сохраняет массив продуктов.
	 * @param products Массив объектов продуктов.
	 */
	public setProducts(products: IFullProduct[]): void {
		this.products = products;
	}

	/**
	 * Возвращает все сохранённые продукты.
	 * @returns Массив продуктов.
	 */
	public getProducts(): IFullProduct[] {
		return this.products;
	}

	/**
	 * Возвращает продукт по его идентификатору.
	 * @param id Уникальный идентификатор продукта.
	 * @returns Найденный продукт или `undefined`, если не найден.
	 */
	public getProductById(id: string): IFullProduct | undefined {
		return this.products.find((product) => product.id === id);
	}

	/**
	 * Устанавливает текущий выбранный продукт.
	 * @param product Объект продукта.
	 */
	public setCurrent(product: IFullProduct): void {
		this.current = product;
	}

	/**
	 * Возвращает текущий выбранный продукт.
	 * @returns Текущий продукт или `undefined`, если не установлен.
	 */
	public getCurrent(): IFullProduct | undefined {
		return this.current;
	}
}
