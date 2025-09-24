export interface ResidentEntity {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  createdAt: Date;
}
