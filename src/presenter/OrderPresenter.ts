import { IOrder } from "../model/Order";

export interface IOrderService {
  submitOrder(order: IOrder): Promise<void>;
}