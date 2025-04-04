/**
 * Базовый класс представления (View).
 * Предоставляет общие методы работы с DOM и шаблонами.
 */
export class BaseView {
	/**
	 * @param {HTMLTemplateElement} template - HTML-шаблон, используемый для генерации элементов представления
	 * @param {string} cdnUrl - Базовый URL для загрузки статических ресурсов
	 * @throws {Error} Если шаблон не передан или не найден
	 */
	constructor(
		protected template: HTMLTemplateElement,
		protected cdnUrl: string
	) {
		if (!template) throw new Error('Template не найден');
	}

	/**
	 * Клонирует и возвращает содержимое шаблона.
	 * @returns {HTMLElement} Клонированный элемент из шаблона
	 */
	protected cloneTemplate(): HTMLElement {
		return this.template.content.cloneNode(true) as HTMLElement;
	}

	/**
	 * Выполняет поиск элемента по селектору внутри заданного корня.
	 * @template T
	 * @param {ParentNode} root - Корневой элемент для поиска
	 * @param {string} selector - CSS-селектор искомого элемента
	 * @returns {T | null} Найденный элемент или null
	 */
	protected qs<T extends HTMLElement>(
		root: ParentNode,
		selector: string
	): T | null {
		return root.querySelector(selector);
	}

	/**
	 * Устанавливает изображение с указанными src и alt.
	 * @param {Element | null} img - Элемент изображения
	 * @param {string} src - Путь к изображению относительно CDN
	 * @param {string} alt - Альтернативный текст изображения
	 */
	protected setImage(img: Element | null, src: string, alt: string): void {
		if (img instanceof HTMLImageElement) {
			img.src = `${this.cdnUrl}/${src}`;
			img.alt = alt;
		}
	}

	/**
	 * Форматирует цену в читаемую строку.
	 * @param {number | null} price - Цена товара или null
	 * @returns {string} Строка с отформатированной ценой
	 */
	protected formatPrice(price: number | null): string {
		return price !== null ? `${price} синапсов` : 'Бесценно';
	}

	/**
	 * Делает указанный элемент видимым, добавляя CSS-класс.
	 * @param {HTMLElement} element - Элемент, который нужно показать
	 */
	protected show(element: HTMLElement): void {
		element.classList.add('modal_active');
	}

	/**
	 * Скрывает указанный элемент, удаляя CSS-класс.
	 * @param {HTMLElement} element - Элемент, который нужно скрыть
	 */
	protected hide(element: HTMLElement): void {
		element.classList.remove('modal_active');
	}

	/**
	 * Привязывает обработчики событий к элементу.
	 * @template T
	 * @param {T} element - Элемент, к которому привязываются события
	 * @param {Record<string, EventListener>} events - Объект событий: ключ — имя события, значение — обработчик
	 */
	protected bindEvents<T extends HTMLElement>(
		element: T,
		events: Record<string, EventListener>
	): void {
		Object.entries(events).forEach(([event, handler]) => {
			element.addEventListener(event, handler);
		});
	}
}
