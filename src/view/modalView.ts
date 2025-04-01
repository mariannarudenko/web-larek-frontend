import { ensureElement, BaseView } from '@/utils/utils';

export class ModalView extends BaseView {
	/** Контейнер модального окна */
	protected modalContainer: HTMLElement;

	/**
	 * Создаёт модальное окно на основе переданного шаблона или существующего DOM-элемента.
	 * @param modalId ID корневого контейнера модального окна.
	 * @param templateId ID HTML-шаблона модального окна.
	 * @param cdnUrl Базовый URL для ресурсов (если требуется).
	 */
	constructor(modalId: string, templateId?: string, cdnUrl = '') {
		const template = templateId
			? ensureElement<HTMLTemplateElement>(`#${templateId}`)
			: document.createElement('template');
		super(template, cdnUrl);

		const existing = document.getElementById(modalId);
		if (existing) {
			this.modalContainer = ensureElement(existing);
		} else {
			const clone = this.cloneTemplate();
			this.modalContainer = document.createElement('div');
			this.modalContainer.id = modalId;
			this.modalContainer.classList.add('modal');
			this.modalContainer.appendChild(clone);
			document.body.appendChild(this.modalContainer);
		}

		this.setupCloseHandlers();
	}

	/**
	 * Отображает модальное окно и проверяет наличие .modal__content внутри шаблона.
	 */
	showModal() {
		const content = this.modalContainer.querySelector('.modal__content');
		this.show(this.modalContainer);
	}

	/** Скрывает модальное окно. */
	hideModal() {
		this.hide(this.modalContainer);
	}

	/**
	 * Настраивает обработчики закрытия модального окна:
	 * - по клику на .modal__close
	 * - по клику на фон вне содержимого
	 */
	protected setupCloseHandlers() {
		const closeBtn = this.modalContainer.querySelector('.modal__close');
		if (closeBtn instanceof HTMLElement) {
			this.bindEvents(closeBtn, {
				click: () => this.hideModal(),
			});
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
