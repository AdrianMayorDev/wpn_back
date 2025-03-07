import { IApiResponse } from '@/interfaces/response.interface';

export const createResponse = <T>(status: 'success' | 'error', message: string, data?: T): IApiResponse<T> => {
  return {
    status,
    message,
    data,
  };
};
