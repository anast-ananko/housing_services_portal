export interface JwtPayload {
  iat: number;
  exp?: number;
  jti: string;
  [key: string]: unknown;
}
