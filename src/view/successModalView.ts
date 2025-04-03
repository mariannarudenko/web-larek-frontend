import { ensureElement, BaseView } from '@/utils/utils';
import { Logger } from '@/utils/logger';

/**
 * Представление модального окна успешного оформления заказа.
 * Отвечает за отображение итоговой суммы и доступ к кнопке закрытия.
 */
export class SuccessModalView extends BaseView {
	private element?: HTMLElement;
	private totalElement!: HTMLElement;
	private closeButton!: HTMLButtonElement;

	constructor(templateId = 'success') {
		const template = ensureElement<HTMLTemplateElement>(
			`template#${templateId}`
		);
		super(template, '');
	}

	/**
	 * Возвращает элемент модального окна, пересоздавая при необходимости.
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
	 * Сброс DOM — пересоздание произойдёт при следующем getElement().
	 */
	public reset(): void {
		this.element = undefined;
	}

	public getCloseButton(): HTMLButtonElement {
		return this.closeButton;
	}

	public setTotal(total: number): void {
		this.totalElement.textContent = `Списано ${total.toLocaleString(
			'ru-RU'
		)} синапсов`;
		Logger.info('Итоговая сумма успешно установлена в модальное окно', {
			total,
		});
	}
}
