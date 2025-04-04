import { ensureElement } from '@/utils/utils';
import { BaseView } from '../base/baseView';

/**
 * Представление модального окна успешного оформления заказа.
 * Отвечает за отображение итоговой суммы и доступ к кнопке закрытия.
 */
export class SuccessView extends BaseView {
	private element?: HTMLElement;
	private totalElement!: HTMLElement;
	private closeButton!: HTMLButtonElement;

	/**
	 * @param {string} [templateId='success'] - ID шаблона модального окна
	 */
	constructor(templateId = 'success') {
		const template = ensureElement<HTMLTemplateElement>(
			`template#${templateId}`
		);
		super(template, '');
	}

	/**
	 * Возвращает DOM-элемент окна. Создаёт при первом вызове.
	 * @returns {HTMLElement} Элемент окна успешного оформления
	 */
	public getElement(): HTMLElement {
		if (!this.element) {
			this.element = this.cloneTemplate();

			this.totalElement = ensureElement<HTMLElement>(
				this.element.querySelector('.order-success__description') as HTMLElement
			);

			this.closeButton = ensureElement<HTMLButtonElement>(
				this.element.querySelector('.order-success__close') as HTMLButtonElement
			);
		}
		return this.element;
	}

	/**
	 * Сбрасывает DOM-состояние окна.
	 * При следующем `getElement()` будет создан новый экземпляр.
	 */
	public reset(): void {
		this.element = undefined;
	}

	/**
	 * Возвращает кнопку закрытия окна.
	 * @returns {HTMLButtonElement} Кнопка закрытия
	 */
	public getCloseButton(): HTMLButtonElement {
		return this.closeButton;
	}

	/**
	 * Устанавливает отображаемую сумму списания.
	 * @param {number} total - Сумма списания в синапсах
	 */
	public setTotal(total: number): void {
		this.totalElement.textContent = `Списано ${total.toLocaleString(
			'ru-RU'
		)} синапсов`;
	}
}
