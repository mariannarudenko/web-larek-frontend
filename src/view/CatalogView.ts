import { ICatalogProduct } from '@/types';
import { IEvents } from '@/components/base/events';
import { CDN_URL } from '@/utils/constants';
import { BaseView } from '@/utils/utils';
import { Logger } from '@/utils/logger';

/**
 * Представление каталога товаров.
 */
export class CatalogView extends BaseView {
	/**
	 * @param container Контейнер для рендеринга каталога.
	 * @param events Система событий.
	 */
	constructor(private container: HTMLElement, private events: IEvents) {
		const template = document.querySelector<HTMLTemplateElement>('#card-catalog');
		if (!template) throw new Error('Шаблон #card-catalog не найден');
		super(template, CDN_URL);
	}

	/**
	 * Очищает контейнер перед рендерингом.
	 */
	public clear(): void {
		this.container.innerHTML = '';
	}

	/**
	 * Создаёт карточку товара.
	 * @param product Товар из каталога.
	 * @returns DOM-элемент карточки.
	 */
	private createCard(product: ICatalogProduct): HTMLElement {
		const card = this.cloneTemplate();

		this.qs(card, '.card__category')!.textContent = product.category;
		this.qs(card, '.card__title')!.textContent = product.title;
		this.setImage(this.qs(card, '.card__image'), product.image, product.title);
		this.qs(card, '.card__price')!.textContent = this.formatPrice(product.price);

		const clickable = this.qs(card, '.card');
		if (clickable) {
			clickable.setAttribute('data-id', product.id);
			clickable.addEventListener('click', () => {
				Logger.info('Выбрана карточка товара', { id: product.id });
				this.events.emit('product:select', { id: product.id });
			});
		}

		return card;
	}

	/**
	 * Отображает список товаров в контейнере.
	 * @param products Массив товаров для отображения.
	 */
	public render(products: ICatalogProduct[]): void {
		this.clear();

		products.forEach((product) => {
			this.container.appendChild(this.createCard(product));
		});

		Logger.info('Каталог отрендерен', { count: products.length });
	}
}
