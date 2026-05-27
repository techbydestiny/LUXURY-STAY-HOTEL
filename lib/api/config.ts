// lib/api/config.ts
import { apiClient } from './client';
import { HotelConfig } from '@/types';

export const configApi = {
  getPublicConfig: async (): Promise<HotelConfig> => {
    const response = await apiClient.get('/config/public/');
    return response.data;
  },
};