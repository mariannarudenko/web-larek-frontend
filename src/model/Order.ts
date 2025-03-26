import { ICartItem } from "./cart";

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

/**
 * Класс, представляющий заказ.
 * Хранит информацию о заказанных товарах и контактные данные.
 */
export class Order implements IOrder {
  /**
   * Создаёт новый заказ.
   * @param {ICartItem[]} items - Список товаров в заказе.
   * @param {number} total - Общая сумма заказа.
   * @param {string} [address] - Адрес доставки.
   * @param {string} [paymentMethod] - Способ оплаты.
   * @param {string} [email] - Email покупателя.
   * @param {string} [phone] - Телефон покупателя.
   */
  constructor(
    public readonly items: ICartItem[],
    public readonly total: number,
    public readonly address?: string,
    public readonly paymentMethod?: string,
    public readonly email?: string,
    public readonly phone?: string
  ) {}
}