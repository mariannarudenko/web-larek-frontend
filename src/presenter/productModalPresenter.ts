import { ProductModalView } from '@/view/productModalView';
import { ProductValidation } from './productValidation';
import { IEvents } from '@/components/base/events';
import { IFullProduct } from '@/types';
import { Logger } from '@/utils/logger';

/**
 * Презентер для управления модальным окном продукта.
 * Реагирует на событие `modal:open`, проводит валидацию и отображает данные.
 */
export class ProductModalPresenter {
	/**
	 * Создаёт экземпляр `ProductModalPresenter`.
	 * @param view - Представление модального окна продукта
	 * @param events - Интерфейс для работы с глобальными событиями
	 */
	constructor(private view: ProductModalView, private events: IEvents) {
		this.events.on<{ product: IFullProduct & { hasCart: boolean } }>(
			'modal:open',
			({ product }) => {
				if (!ProductValidation.validate(product)) {
					Logger.warn(
						'Продукт не прошёл валидацию. Модальное окно не будет открыто.',
						product
					);
					return;
				}

				Logger.info('Открытие модального окна через презентер', product);
				this.view.render(product);
			}
		);
	}
}
