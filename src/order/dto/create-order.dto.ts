export class CreateOrderDto {
  id: number;

  userId: number;

  orderDetailsId: number;

  note: string;

  methor_payment: string;

  size: number;
  quantity: number;
}
