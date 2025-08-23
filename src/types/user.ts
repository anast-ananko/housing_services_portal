export interface User {
  email: string;
  passwordHash: string;
  refreshToken?: string;
}
