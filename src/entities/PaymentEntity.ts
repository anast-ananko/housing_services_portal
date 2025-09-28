import { PaymentMethod, PaymentStatus } from 'types/types';

export interface PaymentEntity {
  id: number;
  request_id: number;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paid_at?: Date | null;
}
