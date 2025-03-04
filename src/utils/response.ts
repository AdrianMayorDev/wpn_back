import { ApiResponse } from '@/interfaces/response.internface';

export const createResponse = <T>(
  status: 'success' | 'error',
  message: string,
  data?: T,
  error?: string
): ApiResponse<T> => {
  return {
    status,
    message,
    data,
    error,
  };
};
