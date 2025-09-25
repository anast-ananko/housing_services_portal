export interface RequestEntity {
  id: number;
  resident_id: number;
  service_id: number;
  manager_id?: number | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  updated_at: Date;
}
