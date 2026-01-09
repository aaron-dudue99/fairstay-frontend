export const API_BASE_URL = 'http://localhost:8080/api';

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
  errors?: any;
};
