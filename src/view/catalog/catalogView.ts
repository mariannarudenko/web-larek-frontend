import { ensureElement } from '@/utils/utils';
import { ICatalogProduct } from '@/types';
import { CDN_URL } from '@/utils/constants';
import { BaseView } from '../base/baseView';
import { Logger } from '@/services/logger';

/**
 * Представление каталога товаров.
 * Отвечает за отображение карточек товаров в DOM.
 */
export class CatalogView extends BaseView {
	private container: HTMLElement;
	private onCardClickCallback: (id: string) => void = () => {};

	/**
	 * Создаёт представление каталога.
	 * Ищет шаблон карточки и контейнер для рендера внутри DOM.
	 */
	constructor() {
		const template = ensureElement<HTMLTemplateElement>('#card-catalog');
		super(template, CDN_URL);
		this.container = ensureElement<HTMLElement>(
			document.querySelector('.gallery') as HTMLElement
		);
	}

	/**
	 * Очищает контейнер каталога.
	 */
	public clear(): void {
		this.container.innerHTML = '';
	}

	/**
	 * Создаёт DOM-элемент карточки товара на основе шаблона.
	 * @param product Товар каталога.
	 * @returns DOM-элемент карточки.
	 */
	private createCard(product: ICatalogProduct): HTMLElement {
		const card = this.cloneTemplate();

		const categoryEl = this.qs(card, '.card__category');
		if (categoryEl) {
			categoryEl.textContent = product.category;
			categoryEl.className = 'card__category';

			const categoryClassMap: Record<string, string> = {
				'софт-скил': 'card__category_soft',
				'хард-скил': 'card__category_hard',
				другое: 'card__category_other',
				дополнительное: 'card__category_additional',
				кнопка: 'card__category_button',
			};

			const cssClass =
				categoryClassMap[product.category] || 'card__category_other';
			categoryEl.classList.add(cssClass);
		}

		this.qs(card, '.card__title')!.textContent = product.title;
		this.setImage(this.qs(card, '.card__image'), product.image, product.title);
		this.qs(card, '.card__price')!.textContent = this.formatPrice(product.price);

		const clickable = this.qs(card, '.card');
		if (clickable) {
			clickable.setAttribute('data-id', product.id);
			clickable.addEventListener('click', () => {
				Logger.info('Выбрана карточка товара', { id: product.id });
				this.onCardClickCallback(product.id);
			});
		}

		return card;
	}

	/**
	 * Отображает список товаров в DOM-контейнере каталога.
	 * @param products Массив товаров для отображения.
	 */
	public render(products: ICatalogProduct[]): void {
		this.clear();

		products.forEach((product) => {
			this.container.appendChild(this.createCard(product));
		});

		Logger.info('Каталог отрендерен', { count: products.length });
	}

	/**
	 * Устанавливает обработчик выбора карточки товара.
	 * @param callback Функция, вызываемая при клике по карточке.
	 */
	public onCardSelect(cb: (id: string) => void): void {
		this.onCardClickCallback = cb;
	}
}
