/**
 * Интерфейс представления, которое можно отрендерить в модальное окно.
 */
export interface RenderableView {
	/**
	 * Возвращает корневой HTML-элемент представления.
	 * @returns {HTMLElement} Элемент DOM
	 */
	getElement(): HTMLElement;
}
