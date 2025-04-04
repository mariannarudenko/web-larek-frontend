/**
 * Класс управления модальным окном.
 * Управляет показом, скрытием, контентом и колбэками модалки.
 */
export class ModalManager {
	private container: HTMLElement;
	private content: HTMLElement;
	private closeCallback: () => void = () => {};

	/**
	 * @param {string} [containerId='modal-container'] - ID контейнера модального окна
	 * @throws {Error} Если контейнер с указанным ID не найден
	 */
	constructor(containerId = 'modal-container') {
		const container = document.getElementById(containerId);
		if (!container) {
			throw new Error(`Modal container #${containerId} не найден`);
		}

		this.container = container;
		this.content = container.querySelector('.modal__content')!;

		this.setupCloseHandlers();
	}

	/**
	 * Показывает модальное окно.
	 */
	public show(): void {
		this.container.classList.add('modal_active');
	}

	/**
	 * Скрывает модальное окно и вызывает колбэк закрытия.
	 */
	public hide(): void {
		this.container.classList.remove('modal_active');
		this.closeCallback();
	}

	/**
	 * Устанавливает содержимое модального окна.
	 * @param {HTMLElement} element - HTML-элемент, который будет вставлен в модалку
	 */
	public setContent(element: HTMLElement): void {
		this.content.innerHTML = '';
		this.content.appendChild(element);
	}

	/**
	 * Очищает содержимое модального окна.
	 */
	public reset(): void {
		this.content.innerHTML = '';
	}

	/**
	 * Проверяет, отображается ли модальное окно.
	 * @returns {boolean} true, если модалка активна
	 */
	public isVisible(): boolean {
		return this.container.classList.contains('modal_active');
	}

	/**
	 * Устанавливает колбэк, вызываемый при закрытии модального окна.
	 * @param {() => void} callback - Функция, вызываемая при закрытии
	 */
	public onClose(callback: () => void): void {
		this.closeCallback = callback;
	}

	/**
	 * Настраивает обработчики событий для закрытия модального окна.
	 * Закрытие по кнопке и при клике вне контента.
	 */
	private setupCloseHandlers(): void {
		const closeBtn = this.container.querySelector('.modal__close');
		if (closeBtn instanceof HTMLElement) {
			closeBtn.addEventListener('click', () => this.hide());
		}

		this.container.addEventListener('click', (e: Event) => {
			if (e.target === this.container) {
				this.hide();
			}
		});
	}
}
