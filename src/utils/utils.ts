export function pascalToKebab(value: string): string {
	return value.replace(/([a-z0–9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function isSelector(x: any): x is string {
	return typeof x === 'string' && x.length > 1;
}

export function isEmpty(value: any): boolean {
	return value === null || value === undefined;
}

export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

export function ensureAllElements<T extends HTMLElement>(
	selectorElement: SelectorCollection<T>,
	context: HTMLElement = document as unknown as HTMLElement
): T[] {
	if (isSelector(selectorElement)) {
		return Array.from(context.querySelectorAll(selectorElement)) as T[];
	}
	if (selectorElement instanceof NodeList) {
		return Array.from(selectorElement) as T[];
	}
	if (Array.isArray(selectorElement)) {
		return selectorElement;
	}
	throw new Error(`Unknown selector element`);
}

export type SelectorElement<T> = T | string;

export function ensureElement<T extends HTMLElement>(
	selectorElement: SelectorElement<T>,
	context?: HTMLElement
): T {
	if (isSelector(selectorElement)) {
		const elements = ensureAllElements<T>(selectorElement, context);
		if (elements.length > 1) {
			console.warn(`selector ${selectorElement} return more then one element`);
		}
		if (elements.length === 0) {
			throw new Error(`selector ${selectorElement} return nothing`);
		}
		return elements.pop() as T;
	}
	if (selectorElement instanceof HTMLElement) {
		return selectorElement as T;
	}
	throw new Error('Unknown selector element');
}

export function cloneTemplate<T extends HTMLElement>(
	query: string | HTMLTemplateElement
): T {
	const template = ensureElement(query) as HTMLTemplateElement;
	return template.content.firstElementChild.cloneNode(true) as T;
}

export function bem(
	block: string,
	element?: string,
	modifier?: string
): { name: string; class: string } {
	let name = block;
	if (element) name += `__${element}`;
	if (modifier) name += `_${modifier}`;
	return {
		name,
		class: `.${name}`,
	};
}

export function getObjectProperties(
	obj: object,
	filter?: (name: string, prop: PropertyDescriptor) => boolean
): string[] {
	return Object.entries(
		Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj))
	)
		.filter(([name, prop]: [string, PropertyDescriptor]) =>
			filter ? filter(name, prop) : name !== 'constructor'
		)
		.map(([name, prop]) => name);
}

/**
 * Устанавливает dataset атрибуты элемента
 */
export function setElementData<T extends Record<string, unknown> | object>(
	el: HTMLElement,
	data: T
) {
	for (const key in data) {
		el.dataset[key] = String(data[key]);
	}
}

/**
 * Получает типизированные данные из dataset атрибутов элемента
 */
export function getElementData<T extends Record<string, unknown>>(
	el: HTMLElement,
	scheme: Record<string, Function>
): T {
	const data: Partial<T> = {};
	for (const key in el.dataset) {
		data[key as keyof T] = scheme[key](el.dataset[key]);
	}
	return data as T;
}

/**
 * Проверка на простой объект
 */
export function isPlainObject(obj: unknown): obj is object {
	const prototype = Object.getPrototypeOf(obj);
	return prototype === Object.getPrototypeOf({}) || prototype === null;
}

export function isBoolean(v: unknown): v is boolean {
	return typeof v === 'boolean';
}

/**
 * Фабрика DOM-элементов в простейшей реализации
 * здесь не учтено много факторов
 * в интернет можно найти более полные реализации
 */
export function createElement<T extends HTMLElement>(
	tagName: keyof HTMLElementTagNameMap,
	props?: Partial<Record<keyof T, string | boolean | object>>,
	children?: HTMLElement | HTMLElement[]
): T {
	const element = document.createElement(tagName) as T;
	if (props) {
		for (const key in props) {
			const value = props[key];
			if (isPlainObject(value) && key === 'dataset') {
				setElementData(element, value);
			} else {
				// @ts-expect-error fix indexing later
				element[key] = isBoolean(value) ? value : String(value);
			}
		}
	}
	if (children) {
		for (const child of Array.isArray(children) ? children : [children]) {
			element.append(child);
		}
	}
	return element;
}

/**
 * Базовый класс представления (View), предоставляющий общие методы работы с DOM и шаблонами.
 */
export class BaseView {
	/**
	 * @param template HTML-шаблон, используемый для генерации элементов представления.
	 * @param cdnUrl Базовый URL для загрузки статических ресурсов.
	 * @throws Если шаблон не передан или не найден.
	 */
	constructor(
		protected template: HTMLTemplateElement,
		protected cdnUrl: string
	) {
		if (!template) throw new Error('Template не найден');
	}

	/**
	 * Клонирует и возвращает содержимое шаблона.
	 *
	 * @returns Клонированный элемент из шаблона.
	 */
	protected cloneTemplate(): HTMLElement {
		return this.template.content.cloneNode(true) as HTMLElement;
	}

	/**
	 * Сокращённый метод поиска элемента по селектору.
	 *
	 * @param root Корневой элемент для поиска.
	 * @param selector CSS-селектор искомого элемента.
	 * @returns Найденный элемент или null.
	 */
	protected qs<T extends HTMLElement>(
		root: ParentNode,
		selector: string
	): T | null {
		return root.querySelector(selector);
	}

	/**
	 * Устанавливает изображение с указанными src и alt.
	 *
	 * @param img Элемент изображения.
	 * @param src Путь к изображению относительно CDN.
	 * @param alt Альтернативный текст изображения.
	 */
	protected setImage(img: Element | null, src: string, alt: string) {
		if (img instanceof HTMLImageElement) {
			img.src = `${this.cdnUrl}/${src}`;
			img.alt = alt;
		}
	}

	/**
	 * Форматирует цену в читаемую строку.
	 *
	 * @param price Цена товара или null.
	 * @returns Строка с отформатированной ценой.
	 */
	protected formatPrice(price: number | null): string {
		return price !== null ? `${price} синапсов` : 'Бесценно';
	}

	/**
	 * Делает указанный элемент видимым, добавляя класс.
	 *
	 * @param element Элемент, который нужно показать.
	 */
	protected show(element: HTMLElement) {
		element.classList.add('modal_active');
	}

	/**
	 * Скрывает указанный элемент, удаляя класс.
	 *
	 * @param element Элемент, который нужно скрыть.
	 */
	protected hide(element: HTMLElement) {
		element.classList.remove('modal_active');
	}

	/**
	 * Универсальный метод привязки обработчиков событий к элементу.
	 *
	 * @param element Элемент, к которому привязываются события.
	 * @param events Объект, где ключ — событие, значение — обработчик.
	 */
	protected bindEvents<T extends HTMLElement>(
		element: T,
		events: Record<string, EventListener>
	) {
		Object.entries(events).forEach(([event, handler]) => {
			element.addEventListener(event, handler);
		});
	}
}
