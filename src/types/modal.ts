/**
 * Интерфейс для представлений, которые можно отрендерить в модалку.
 */
export interface RenderableView {
	getElement(): HTMLElement;
}