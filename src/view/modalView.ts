import { ensureElement, BaseView } from '@/utils/utils';

export class ModalView extends BaseView {
	/** Контейнер модального окна */
	protected modalContainer: HTMLElement;

	constructor(modalId: string, templateId?: string, cdnUrl = '') {
		// Передаём в BaseView загруженный шаблон (если есть)
		const template = templateId
			? ensureElement<HTMLTemplateElement>(`#${templateId}`)
			: document.createElement('template');
		super(template, cdnUrl);

		// Создаём или находим контейнер модального окна
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

	/** Отображает модальное окно. */
	showModal() {
		this.show(this.modalContainer);
	}

	/** Скрывает модальное окно. */
	hideModal() {
		this.hide(this.modalContainer);
	}

	/** Настраивает обработчики закрытия модального окна. */
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
