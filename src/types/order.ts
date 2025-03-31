import type { ICartItem } from "./cart";

/**
 * Интерфейс заказа.
 * Описывает структуру заказа, включая список товаров, сумму и контактные данные.
 */
export interface IOrder {
  /** Список товаров в заказе */
  readonly items: ICartItem[];

  /** Общая сумма заказа */
  readonly total: number;

  /** Адрес доставки (необязательное поле) */
  readonly address?: string;

  /** Способ оплаты (необязательное поле) */
  readonly paymentMethod?: string;

  /** Email покупателя (необязательное поле) */
  readonly email?: string;

  /** Телефон покупателя (необязательное поле) */
  readonly phone?: string;
}
