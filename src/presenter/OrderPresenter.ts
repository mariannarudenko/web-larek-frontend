import { IOrder } from "../model/order";

export interface IOrderService {
  submitOrder(order: IOrder): Promise<void>;
}