export interface PaymentEntity {
  id: number;
  request_id: number;
  amount: number;
  method: 'card' | 'cash' | 'online';
  status: 'pending' | 'paid' | 'failed';
  paid_at?: Date | null;
}
