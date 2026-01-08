export type RegisterUserForm = {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: 'TENANT' | 'LANDLORD';
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'TENANT' | 'LANDLORD';
  isEnabled: boolean;
  createdAt: string;
};
