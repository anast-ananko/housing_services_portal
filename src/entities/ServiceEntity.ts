export interface ServiceEntity {
  id: number;
  name: string;
  description?: string | null;
  cost: number;
  is_active: boolean;
}
