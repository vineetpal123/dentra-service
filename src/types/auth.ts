export interface JwtUser {
  userId: string;
  tenantId: string;
  role: 'admin' | 'doctor' | 'staff';
  id?: string;
}
