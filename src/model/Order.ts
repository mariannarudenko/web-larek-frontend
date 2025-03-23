import { ICartItem } from "./Cart";

export interface IOrder {
  readonly items: ICartItem[];
  readonly total: number;
  readonly address?: string;
  readonly paymentMethod?: string;
  readonly email?: string;
  readonly phone?: string;
}

export class Order implements IOrder {
  constructor(
    public readonly items: ICartItem[],
    public readonly total: number,
    public readonly address?: string,
    public readonly paymentMethod?: string,
    public readonly email?: string,
    public readonly phone?: string
  ) {}
}