import { ensureElement } from '@/utils/utils';
import { BaseView } from '../base/baseView';

/**
 * Представление экрана успешного оформления заказа.
 * Показывает финальное сообщение и сумму списания.
 */
export class SuccessView extends BaseView {
	private element: HTMLElement;
	private totalElement: HTMLElement;
	private closeButton: HTMLButtonElement;
  private total: number;
	private onCloseCallback: () => void = () => {};

	/**
	 * Создает экземпляр SuccessView.
	 * @param props - Объект с шиной событий, модальным менеджером и необязательным колбэком закрытия.
	 * @param templateId - Идентификатор шаблона (по умолчанию `'success'`).
	 * @throws Ошибка, если шаблон не найден.
	 */
	constructor(templateId = 'success') {
		const template = ensureElement<HTMLTemplateElement>(`template#${templateId}`);
		super(template, '');

		const fragment = this.cloneTemplate();
		this.element = fragment.firstElementChild as HTMLElement;

		this.totalElement = ensureElement<HTMLElement>(
			this.element.querySelector('.order-success__description') as HTMLElement
		);

		this.closeButton = ensureElement<HTMLButtonElement>(
			this.element.querySelector('.order-success__close') as HTMLButtonElement
		);

		this.closeButton.addEventListener('click', () => {
			this.onCloseCallback();
		});
	}

	/**
	 * Возвращает корневой DOM-элемент представления.
	 * @returns HTML-элемент представления.
	 */
	public getElement(): HTMLElement {
		return this.element;
	}
	
	/**
	 * Устанавливает общую сумму заказа.
	 * @param total - Сумма, которая будет отображена в сообщении.
	 */
	public setTotal(total: number): void {
		this.total = total;
		this.totalElement.textContent = `Списано ${total.toLocaleString('ru-RU')} синапсов`;
	}

	/**
	 * Устанавливает обработчик закрытия.
	 */
	public setOnClose(cb: () => void): void {
		this.onCloseCallback = cb;
	}
}