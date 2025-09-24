export interface UserEntity {
  id: number;
  email: string;
  password_hash: string;
  refresh_token?: string | null;
  role: 'resident' | 'manager' | 'admin';
  resident_id?: number | null;
  manager_id?: number | null;
}
