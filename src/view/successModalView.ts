import { ensureElement, BaseView } from '@/utils/utils';
import { Logger } from '@/utils/logger';

/**
 * Представление модального окна успешного оформления заказа.
 * Отвечает за отображение итоговой суммы и доступ к кнопке закрытия.
 */
export class SuccessModalView extends BaseView {
	private element: HTMLElement;
	private totalElement: HTMLElement;
	private closeButton: HTMLButtonElement;

	/**
	 * @param templateId ID шаблона модального окна (по умолчанию "success").
	 */
	constructor(templateId = 'success') {
		const template = ensureElement<HTMLTemplateElement>(
			`template#${templateId}`
		);
		super(template, '');
		this.element = this.cloneTemplate();

		this.totalElement = ensureElement<HTMLElement>(
			this.element.querySelector('.order-success__description') as HTMLElement
		);

		this.closeButton = ensureElement<HTMLButtonElement>(
			this.element.querySelector('.order-success__close') as HTMLButtonElement
		);
	}

	/**
	 * Возвращает элемент модального окна.
	 * @returns HTML-элемент модального окна.
	 */
	public getElement(): HTMLElement {
		return this.element;
	}

	/**
	 * Возвращает кнопку закрытия модального окна.
	 * @returns HTML-кнопка закрытия.
	 */
	public getCloseButton(): HTMLButtonElement {
		return this.closeButton;
	}

	/**
	 * Устанавливает итоговую сумму в модальное окно.
	 * @param total Итоговая сумма.
	 */
	public setTotal(total: number): void {
		this.totalElement.textContent = `Списано ${total.toLocaleString(
			'ru-RU'
		)} синапсов`;
		Logger.info('Итоговая сумма успешно установлена в модальное окно', {
			total,
		});
	}
}
