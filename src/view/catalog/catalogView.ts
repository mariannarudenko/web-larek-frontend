import { ICatalogProduct } from '@/types';
import { CDN_URL } from '@/utils/constants';
import { BaseView } from '../base/baseView';
import { Logger } from '@/services/logger';

/**
 * Представление каталога товаров.
 * Отвечает за отображение карточек товаров в DOM.
 */
export class CatalogView extends BaseView {
	/**
	 * @param container DOM-элемент, в который будут вставляться карточки товаров.
	 * @throws Ошибка, если шаблон карточки не найден.
	 */
	constructor(private container: HTMLElement) {
		const template =
			document.querySelector<HTMLTemplateElement>('#card-catalog');
		if (!template) throw new Error('Шаблон #card-catalog не найден');
		super(template, CDN_URL);
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
		this.qs(card, '.card__price')!.textContent = this.formatPrice(
			product.price
		);

		const clickable = this.qs(card, '.card');
		if (clickable) {
			clickable.setAttribute('data-id', product.id);
		}

		return card;
	}

	/**
	 * Навешивает обработчики кликов на карточки товаров.
	 * @param callback Функция, вызываемая при клике по карточке с её id.
	 */
	public bindCardClicks(callback: (id: string) => void): void {
		this.container.querySelectorAll('.card').forEach((el) => {
			const id = el.getAttribute('data-id');
			if (id) {
				el.addEventListener('click', () => {
					Logger.info('Выбрана карточка товара', { id });
					callback(id);
				});
			}
		});
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
}
