export interface ResidentEntity {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  created_at: Date;
}
