import { ensureElement, cloneTemplate, BaseView } from '@/utils/utils';
import { Logger } from '@/utils/logger';

import { RenderableView } from '@/types/modal';

/**
 * Базовый класс представления модального окна.
 */
export class ModalView extends BaseView {
	/** Контейнер модального окна */
	protected modalContainer: HTMLElement;

	/** Элемент, в который будет вставляться контент */
	protected contentElement: HTMLElement;

	/**
	 * @param templateId ID шаблона модального окна.
	 * @param cdnUrl Базовый URL для ресурсов (по умолчанию пустой).
	 */
	constructor(templateId: string, cdnUrl = '') {
		const template = ensureElement<HTMLTemplateElement>(
			`template#${templateId}`
		);
		super(template, cdnUrl);

		this.modalContainer = ensureElement<HTMLElement>('#modal-container');

		this.contentElement = ensureElement<HTMLElement>(
			'.modal__content',
			this.modalContainer
		);

		// Очистка и вставка шаблона
		this.contentElement.innerHTML = '';
		const content = cloneTemplate<HTMLElement>(template);
		this.contentElement.appendChild(content);

		this.setupCloseHandlers();
	}

	/**
	 * Рендер переданного представления в модальное окно.
	 * @param view Представление с методом getElement().
	 */
	public render(view: RenderableView): void {
		this.contentElement.innerHTML = '';
		this.contentElement.appendChild(view.getElement());
	}

	/**
	 * Отображает модальное окно.
	 */
	public showModal(): void {
		this.show(this.modalContainer);
	}

	/**
	 * Скрывает модальное окно.
	 */
	public hideModal(): void {
		this.hide(this.modalContainer);
	}

	/**
	 * Настраивает обработчики закрытия:
	 * - по клику на .modal__close
	 * - по клику на фон
	 */
	protected setupCloseHandlers(): void {
		const closeBtn = this.modalContainer.querySelector('.modal__close');
		if (closeBtn instanceof HTMLElement) {
			this.bindEvents(closeBtn, {
				click: () => this.hideModal(),
			});
		} else {
			Logger.warn('Кнопка закрытия (.modal__close) не найдена в контейнере.');
		}

		this.bindEvents(this.modalContainer, {
			click: (e: Event) => {
				if (e.target === this.modalContainer) {
					this.hideModal();
				}
			},
		});
	}
}
