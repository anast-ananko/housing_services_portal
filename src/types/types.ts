export interface User {
  id: number;
  email: string;
  role: string;
}

export type ManagerRole = 'admin' | 'technician' | 'support';

export type PaymentMethod = 'card' | 'cash' | 'online';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type RequestStatus = 'pending' | 'approved' | 'rejected';
