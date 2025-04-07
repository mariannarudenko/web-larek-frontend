import { ensureElement } from '@/utils/utils';

/**
 * Представление общей страницы.
 * Отвечает за отображение и взаимодействие с элементами вне модальных окон — например, хедером и кнопкой корзины.
 */
export class PageView {
	private basketButton: HTMLButtonElement;
	private counter: HTMLElement;
	private onCartClickCallback: () => void = () => {};

	/**
	 * Создаёт представление страницы и инициализирует обработчики.
	 */
	constructor() {
		this.basketButton = ensureElement<HTMLButtonElement>(
			document.querySelector('.header__basket') as HTMLButtonElement
		);

		this.counter = ensureElement<HTMLElement>(
			document.querySelector('.header__basket-counter') as HTMLElement
		);

		this.basketButton.addEventListener('click', () => {
			this.onCartClickCallback();
		});
	}

	/**
	 * Обновляет отображение счётчика товаров в корзине.
	 * @param count Количество товаров в корзине.
	 */
	public updateCartCounter(count: number): void {
		this.counter.textContent = String(count);
	}

	/**
	 * Устанавливает обработчик нажатия на кнопку корзины.
	 * @param cb Функция-обработчик.
	 */
	public setOnCartClick(cb: () => void): void {
		this.onCartClickCallback = cb;
	}
}
