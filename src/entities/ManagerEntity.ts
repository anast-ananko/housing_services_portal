export interface ManagerEntity {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: 'admin' | 'technician' | 'support';
}
