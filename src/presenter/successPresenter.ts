import { SuccessModalView } from '@/view/successModalView';
import { Logger } from '@/utils/logger';

/**
 * Презентер финального шага — успешное оформление заказа.
 */
export class SuccessPresenter {
	private isMounted = false;

	/**
	 * @param view Представление модального окна.
	 * @param total Итоговая сумма заказа.
	 * @param onClose Колбэк при закрытии окна.
	 */
	constructor(
		private view: SuccessModalView,
		private total: number,
		private onClose: () => void
	) {}

	/**
	 * Инициализирует модальное окно и навешивает обработчик закрытия.
	 */
	public init(): void {
		if (this.isMounted) return;
		this.isMounted = true;

		this.view.setTotal(this.total);
		Logger.info('Открыто окно успешного оформления заказа', {
			total: this.total,
		});

		this.view.getCloseButton().addEventListener('click', () => {
			Logger.info('Закрытие окна успешного оформления заказа');
			this.onClose();
		});
	}
}
