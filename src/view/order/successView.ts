import { ensureElement } from '@/utils/utils';
import { BaseView } from '../base/baseView';
import { EventEmitter } from '@/components/base/events';
import { ModalManager } from '../base/modalManager';

interface SuccessViewProps {
	eventBus: EventEmitter;
	modalManager: ModalManager;
	onClose?: () => void;
}

/**
 * Представление экрана успешного оформления заказа.
 * Показывает финальное сообщение и сумму списания.
 */
export class SuccessView extends BaseView {
	private element: HTMLElement;
	private totalElement: HTMLElement;
	private closeButton: HTMLButtonElement;

	private eventBus: EventEmitter;
	private modalManager: ModalManager;
	public onClose?: () => void;

	private total: number = 0;

	/**
	 * Создает экземпляр SuccessView.
	 * @param props - Объект с шиной событий, модальным менеджером и необязательным колбэком закрытия.
	 * @param templateId - Идентификатор шаблона (по умолчанию `'success'`).
	 * @throws Ошибка, если шаблон не найден.
	 */
	constructor({ eventBus, modalManager, onClose }: SuccessViewProps, templateId = 'success') {
		const template = ensureElement<HTMLTemplateElement>(`template#${templateId}`);
		super(template, '');

		const fragment = this.cloneTemplate();
		this.element = fragment.firstElementChild as HTMLElement;

		this.eventBus = eventBus;
		this.modalManager = modalManager;
		this.onClose = onClose;

		this.totalElement = ensureElement<HTMLElement>(
			this.element.querySelector('.order-success__description') as HTMLElement
		);

		this.closeButton = ensureElement<HTMLButtonElement>(
			this.element.querySelector('.order-success__close') as HTMLButtonElement
		);

		this.closeButton.addEventListener('click', () => {
			this.onClose?.();
		});

		this.eventBus.on('order:success', () => {
			this.setTotal(this.total);
			this.modalManager.setContent(this.getElement());
			this.modalManager.show();
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
	 * Возвращает кнопку закрытия модального окна.
	 * @returns HTML-кнопка закрытия.
	 */
	public getCloseButton(): HTMLButtonElement {
		return this.closeButton;
	}

	/**
	 * Устанавливает общую сумму заказа.
	 * @param total - Сумма, которая будет отображена в сообщении.
	 */
	public setTotal(total: number): void {
		this.total = total;
		this.totalElement.textContent = `Списано ${total.toLocaleString('ru-RU')} синапсов`;
	}
}