export interface User {
  id: number;
  email: string;
  role: 'resident' | 'manager' | 'admin';
  password_hash: string;
  refresh_token?: string | null;
  resident_id?: number | null;
  manager_id?: number | null;
}
