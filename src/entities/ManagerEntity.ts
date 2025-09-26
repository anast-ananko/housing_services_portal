import { ManagerRole } from "types/types";

export interface ManagerEntity {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: ManagerRole;
}
