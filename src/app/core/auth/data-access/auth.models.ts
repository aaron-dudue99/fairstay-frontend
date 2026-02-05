export type UserRole = 'LANDLORD' | 'TENANT';

export type RegisterUserForm = {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: UserRole;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  isEnabled: boolean;
  createdAt?: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  status: AuthStatus;
  error: string | null;
  initialized: boolean;
};
